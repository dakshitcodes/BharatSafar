/** Shared evidence and eligibility rules for disruption records. */
export const DISRUPTION_POLICY = Object.freeze({
  asOfDate: "2026-10-14",
  maximumEvidenceAgeDays: 90,
  maximumTriggerAssessmentAgeDays: 30,
  fullClosureScope: "FULL_DESTINATION",
  supportedScopes: Object.freeze([
    "FULL_DESTINATION",
    "BOATING_AND_BATHING",
    "STAIRCASE_DESCENT",
    "RIVERBANK_ACCESS",
    "WEATHER_ADVISORY",
    "ACCESS_ROUTE_HAZARD",
    "CAMPING_ONLY",
    "ENTRY_CAP_AND_TIME_RESTRICTION",
    "TRAIL_SECTION",
    "ACCESS_ROUTE",
    "SPECIFIC_ACTIVITY",
  ]),
});

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value
    ? null
    : parsed;
}

/**
 * Event dates are root-level inclusive ISO dates (`effectiveFrom`, `effectiveTo`).
 * Both bounds are required: missing or legacy free-text dates mean event validity
 * is unknown, never that the restriction is active.
 */
export function getDisruptionEventStatus(record, asOfDate = DISRUPTION_POLICY.asOfDate) {
  const asOf = validDate(asOfDate);
  if (!asOf) return { effective: false, known: false, reason: "invalid-as-of-date" };
  const start = record?.effectiveFrom == null ? null : validDate(record.effectiveFrom);
  const end = record?.effectiveTo == null ? null : validDate(record.effectiveTo);
  if (record?.effectiveFrom != null && !start) return { effective: false, known: false, reason: "invalid-effective-start" };
  if (record?.effectiveTo != null && !end) return { effective: false, known: false, reason: "invalid-effective-end" };
  if (!start || !end) return { effective: false, known: false, reason: "event-validity-dates-missing" };
  if (start > asOf) return { effective: false, known: true, reason: "not-yet-effective" };
  if (end < asOf) return { effective: false, known: true, reason: "event-expired" };
  return { effective: true, known: true, reason: "effective-on-as-of-date" };
}

export function isDisruptionEffective(record, asOfDate = DISRUPTION_POLICY.asOfDate) {
  return getDisruptionEventStatus(record, asOfDate).effective;
}

export function getConditionalTriggerStatus(record, asOfDate = DISRUPTION_POLICY.asOfDate) {
  if (record?.isConditional !== true) return { confirmed: true, reason: "not-conditional" };
  if (record.triggerStatus !== "met") return { confirmed: false, reason: "conditional-trigger-unconfirmed" };
  const asOf = validDate(asOfDate);
  const checkedAt = validDate(record.triggerCheckedAt);
  if (!asOf || !checkedAt || checkedAt > asOf) {
    return { confirmed: false, reason: "invalid-trigger-assessment-date" };
  }
  if (Math.floor((asOf - checkedAt) / 86400000) > DISRUPTION_POLICY.maximumTriggerAssessmentAgeDays) {
    return { confirmed: false, reason: "stale-trigger-assessment" };
  }
  let url;
  try { url = new URL(record.triggerEvidenceUrl); } catch {
    return { confirmed: false, reason: "missing-trigger-evidence" };
  }
  if (!/^https?:$/.test(url.protocol) || url.pathname === "/" ||
      !record.triggerEvidenceTitle || !record.triggerEvidenceAuthority) {
    return { confirmed: false, reason: "incomplete-trigger-evidence" };
  }
  if (record.triggerEvidenceClaimSupported !== true) {
    return { confirmed: false, reason: "trigger-evidence-claim-not-confirmed" };
  }
  return { confirmed: true, reason: "trigger-confirmed-current" };
}

/**
 * Evidence is usable only when direct source content and scope are explicitly
 * recorded as reviewed recently. Metadata alone cannot establish that a source
 * supports a claim; `claimSupported` and `scopeSupported` are human review assertions.
 * Generic authority homepages do not count as direct evidence.
 */
export function getDisruptionEvidenceStatus(
  record,
  asOfDate = DISRUPTION_POLICY.asOfDate
) {
  const evidence = record?.evidence ?? {};
  const result = { usable: false, reason: "unverified", evidence };

  if (evidence.verificationStatus !== "verified") return result;
  let url;
  try {
    url = new URL(evidence.sourceUrl);
  } catch {
    result.reason = "missing-direct-source";
    return result;
  }
  if (!/^https?:$/.test(url.protocol) || url.pathname === "/") {
    result.reason = "missing-direct-source";
    return result;
  }
  if (!evidence.sourceTitle || !evidence.issuingAuthority) {
    result.reason = "incomplete-source-metadata";
    return result;
  }
  if (evidence.claimSupported !== true) {
    result.reason = "source-claim-not-confirmed";
    return result;
  }
  if (evidence.scopeSupported !== true) {
    result.reason = "source-scope-not-confirmed";
    return result;
  }

  const verifiedAt = validDate(evidence.lastVerifiedAt);
  const asOf = validDate(asOfDate);
  if (!verifiedAt || !asOf || verifiedAt > asOf) {
    result.reason = "invalid-verification-date";
    return result;
  }
  const ageDays = Math.floor((asOf - verifiedAt) / 86400000);
  if (ageDays > DISRUPTION_POLICY.maximumEvidenceAgeDays) {
    result.reason = "expired-verification";
    return result;
  }
  const validThrough = evidence.validThrough == null ? null : validDate(evidence.validThrough);
  if (evidence.validThrough != null && !validThrough) {
    result.reason = "invalid-expiry-date";
    return result;
  }
  if (validThrough && validThrough < asOf) {
    result.reason = "expired-source";
    return result;
  }
  if (!DISRUPTION_POLICY.supportedScopes.includes(record.restrictionScope)) {
    result.reason = "unknown-scope";
    return result;
  }
  return { usable: true, reason: "verified-current", evidence };
}

export function isVerifiedFullClosure(
  record,
  asOfDate = DISRUPTION_POLICY.asOfDate
) {
  return (
    record?.isAbsoluteClosure === true &&
    record.restrictionScope === DISRUPTION_POLICY.fullClosureScope &&
    getDisruptionEvidenceStatus(record, asOfDate).usable &&
    isDisruptionEffective(record, asOfDate) &&
    getConditionalTriggerStatus(record, asOfDate).confirmed
  );
}

/**
 * This checks scope applicability only; it does not verify evidence, dates, or
 * triggers. Destination-wide closures apply across activities, while a partial
 * restriction requires an explicit activity list consistent with its scope.
 */
export function getActivityApplicability(record, activity) {
  if (record?.isAbsoluteClosure === true &&
      record.restrictionScope === DISRUPTION_POLICY.fullClosureScope) {
    return { applies: true, known: true, reason: "activity-scope-not-needed-for-full-destination-closure" };
  }
  if (!Array.isArray(record?.appliesToActivities)) {
    return { applies: false, known: false, reason: "activity-scope-not-specified" };
  }
  const scopeActivities = {
    BOATING_AND_BATHING: ["waterfalls"],
    STAIRCASE_DESCENT: ["trekking", "waterfalls"],
    RIVERBANK_ACCESS: ["waterfalls"],
    WEATHER_ADVISORY: ["trekking", "waterfalls"],
    ACCESS_ROUTE_HAZARD: ["trekking", "waterfalls"],
    CAMPING_ONLY: ["trekking"],
    ENTRY_CAP_AND_TIME_RESTRICTION: ["trekking", "waterfalls"],
    TRAIL_SECTION: ["trekking"],
    ACCESS_ROUTE: ["trekking", "waterfalls"],
    SPECIFIC_ACTIVITY: ["trekking", "waterfalls"],
  };
  const scopeMatchesActivity = scopeActivities[record.restrictionScope]?.includes(activity) ?? false;
  if (!scopeMatchesActivity) {
    return { applies: false, known: true, reason: "restriction-scope-does-not-match-activity" };
  }
  const applies = record.appliesToActivities.includes("all") || record.appliesToActivities.includes(activity);
  return {
    applies,
    known: true,
    reason: applies ? "activity-scope-matches" : "not-applicable-to-activity",
  };
}

export function getApplicableVerifiedDisruptions(
  destinationId,
  month,
  records,
  asOfDate = DISRUPTION_POLICY.asOfDate,
  activity
) {
  if (activity !== "trekking" && activity !== "waterfalls") {
    throw new TypeError('activity must be the destination category "trekking" or "waterfalls".');
  }
  const monthNumber = Number(month);
  return records.filter(
    (record) =>
      record.destinationId === destinationId &&
      Array.isArray(record.applicableMonths) &&
      record.applicableMonths.includes(monthNumber) &&
      isDisruptionEffective(record, asOfDate) &&
      getDisruptionEvidenceStatus(record, asOfDate).usable &&
      getConditionalTriggerStatus(record, asOfDate).confirmed &&
      getActivityApplicability(record, activity).known &&
      getActivityApplicability(record, activity).applies
  );
}
