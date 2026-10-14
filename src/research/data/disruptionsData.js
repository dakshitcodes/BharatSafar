/**
 * disruptionsData.js — Supplied disruption records for the research benchmark
 *
 * RESEARCH INTEGRITY NOTES (2026-10-14):
 * 1. Each record includes an `evidence` block. To affect Method C, a record
 *    must have verificationStatus `verified`, direct source metadata, fresh
 *    lastVerifiedAt, and explicit claimSupported/scopeSupported review flags.
 *    Those flags document human review; the software does not verify page content.
 *    Verification status can be:
 *    "verified"   — source URL confirmed and content reviewed
 *    "unverified" — authority/order name is plausible but no URL has been confirmed
 *    "conditional"— restriction applies only when a trigger condition is met
 * 2. Unverified records do not affect Method C or closure-conflict metrics. They
 *    remain in the audit output with the reason they were not applied.
 * 3. officialOrderReference strings are reference identifiers used internally. They do
 *    not imply the order text is publicly available — see evidence.sourceUrl.
 * 4. penaltyMultiplier is a design parameter (0 = hard block, 1 = no penalty).
 *    The rationale for each value is documented inline.
 * 5. Active event validity requires root-level effectiveFrom/effectiveTo ISO dates
 *    covering the benchmark as-of date. Existing nested free-text date descriptions
 *    are retained as notes and do not establish an active restriction.
 * 6. Partial records need an explicit appliesToActivities list consistent with
 *    restrictionScope. Do not infer that scope from destination category alone.
 */
export const disruptionsData = [
  {
    id: "disrupt-vof-winter",
    destinationId: "dest-trk-02",
    destinationName: "Valley of Flowers Trek",
    applicableMonths: [1, 2, 3, 4, 5, 11, 12],
    disruptionType: "OFFICIAL_CLOSURE",
    severity: "CRITICAL",
    authority: "Uttarakhand Forest Department & Nanda Devi Biosphere Reserve Directorate",
    officialOrderReference: "NDBR/UKFD/SEC-144/ALPINE-WINTER-BAN",
    title: "Mandatory Annual Winter Park Closure",
    description: "Valley of Flowers National Park is legally closed to all visitors from November 1 to May 31 each year. The region is buried under 10-15 feet of snow with active avalanche risk. Entry is strictly prohibited under Wildlife Protection Act 1972.",
    isAbsoluteClosure: true,
    // penaltyMultiplier 0.0 = hard block; destination is quarantined (not ranked)
    penaltyMultiplier: 0.0,
    restrictionScope: "FULL_DESTINATION",
    evidence: {
      sourceUrl: "https://www.ndbr.gov.in/",
      sourceTitle: "Nanda Devi Biosphere Reserve — Park Access Regulations",
      issuingAuthority: "Uttarakhand Forest Department (Chamoli Division)",
      publicationDate: null,
      effectiveFrom: "November 01 (annually)",
      effectiveTo: "May 31 (annually)",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Closure season is widely published by trekking operators and tourism bodies; official gazette URL not confirmed at time of writing."
    }
  },
  {
    id: "disrupt-dudhsagar-monsoon",
    destinationId: "dest-wf-01",
    destinationName: "Dudhsagar Falls",
    applicableMonths: [7, 8],
    disruptionType: "OFFICIAL_CLOSURE",
    severity: "CRITICAL",
    authority: "South Western Railway (Hubballi Division) & Goa Forest Department",
    officialOrderReference: "SWR/GOA-FD/TREK-BAN/MONSOON",
    title: "Monsoon Railway Track Trekking & Jeep Safari Prohibition",
    description: "Jeep safaris through Bhagwan Mahavir Wildlife Sanctuary are suspended due to river swelling. Walking on the Dudhsagar railway tracks and bridge is legally banned with police deployment and heavy fines following fatal slipping incidents.",
    isAbsoluteClosure: true,
    penaltyMultiplier: 0.0,
    restrictionScope: "FULL_DESTINATION",
    evidence: {
      sourceUrl: "https://goaforest.com/",
      sourceTitle: "Goa Forest Department — Bhagwan Mahavir Wildlife Sanctuary Notices",
      issuingAuthority: "Goa Forest Department & South Western Railway (Hubballi Division)",
      publicationDate: null,
      effectiveFrom: "July 01 (monsoon season)",
      effectiveTo: "August 31 (monsoon season)",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Annual monsoon ban is consistently reported by South Western Railway and tourist advisories; official notification URL not confirmed."
    }
  },
  {
    id: "disrupt-chembra-monsoon",
    destinationId: "dest-trk-04",
    destinationName: "Chembra Peak Trek",
    applicableMonths: [7, 8],
    disruptionType: "OFFICIAL_CLOSURE",
    severity: "CRITICAL",
    authority: "South Wayanad Forest Development Agency (VSS) & Kerala Forest Dept",
    officialOrderReference: "SWFDA/MEPPADI-VSS/ORDER-07",
    title: "Monsoon Landslide Safety Suspension",
    description: "All trekking permits to Chembra Peak and Hridaya Saras are suspended during peak Southwest monsoon due to severe landslide vulnerabilities, soil liquefaction, and extreme leech infestation.",
    isAbsoluteClosure: true,
    penaltyMultiplier: 0.0,
    restrictionScope: "FULL_DESTINATION",
    evidence: {
      sourceUrl: "https://forest.kerala.gov.in/",
      sourceTitle: "Kerala Forest Department — Chembra Peak Trekking Permits",
      issuingAuthority: "South Wayanad Forest Development Agency (VSS)",
      publicationDate: null,
      effectiveFrom: "June 15 – September 15 (approximately, weather-dependent)",
      effectiveTo: null,
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Seasonal permit suspension is reported by Kerala Forest Dept and DTPC Wayanad; exact gazette order URL not confirmed."
    }
  },
  {
    id: "disrupt-hogenakkal-flood",
    destinationId: "dest-wf-05",
    destinationName: "Hogenakkal Falls",
    applicableMonths: [7, 8],
    disruptionType: "ACTIVITY_BAN",
    severity: "HIGH",
    authority: "Dharmapuri District Disaster Management Authority",
    officialOrderReference: "DDMA/DPI/KAVERI-FLOOD-ALERT",
    title: "Coracle Boating & Gorge Bathing Ban",
    description: "Coracle boat operations and waterfall gorge bathing are officially banned when Kaveri river inflow from Mettur/KRS exceeds 18,000 cusecs. Tourists can only view cataracts from the high watchtower bridge.",
    isAbsoluteClosure: false,
    // SCOPE: boating and bathing only. Viewpoint access remains open.
    // penaltyMultiplier 0.35 reflects major activity degradation (boating is the primary draw)
    penaltyMultiplier: 0.35,
    restrictionScope: "BOATING_AND_BATHING",
    isConditional: true,
    triggerStatus: "unknown",
    evidence: {
      sourceUrl: "https://dharmapuri.nic.in/",
      sourceTitle: "Dharmapuri District Collectorate — Tourism Advisories",
      issuingAuthority: "Dharmapuri District Disaster Management Authority",
      publicationDate: null,
      effectiveFrom: "Triggered by Kaveri inflow >18,000 cusecs (July–August typically)",
      effectiveTo: null,
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Ban trigger threshold (18,000 cusecs) is widely reported; official DDMA order URL not confirmed. This is a condition-based restriction, not a fixed calendar closure."
    }
  },
  {
    id: "disrupt-jog-stairs",
    destinationId: "dest-wf-02",
    destinationName: "Jog Falls",
    applicableMonths: [7, 8],
    disruptionType: "SAFETY_WARNING",
    severity: "MEDIUM",
    authority: "Jog Management Authority / Karnataka Tourism Police",
    officialOrderReference: "JMA/SAFETY/MONSOON-GORGE-RESTRICT",
    title: "Gorge Descent Stairs Closed for Safety",
    description: "The 1,400-step stone staircase to the bottom of the falls is closed to prevent slips on algae-covered wet steps and respiratory distress from high-velocity mist. Top viewpoints remain fully operational.",
    isAbsoluteClosure: false,
    // SCOPE: staircase descent only. Top viewpoints remain open.
    // penaltyMultiplier 0.70: significant but partial restriction (viewpoints still accessible)
    penaltyMultiplier: 0.70,
    restrictionScope: "STAIRCASE_DESCENT",
    evidence: {
      sourceUrl: "https://shivamogga.nic.in/en/tourist-place/jog-falls/",
      sourceTitle: "Jog Falls — Shivamogga District Tourism Official Page",
      issuingAuthority: "Jog Management Authority / Karnataka Tourism",
      publicationDate: null,
      effectiveFrom: "July (monsoon onset)",
      effectiveTo: "September (approximately)",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Staircase closure during monsoon is well-documented by Karnataka Tourism; official seasonal order URL not confirmed."
    }
  },
  {
    id: "disrupt-athirappilly-alert",
    destinationId: "dest-wf-03",
    destinationName: "Athirappilly Falls",
    applicableMonths: [7, 8],
    disruptionType: "SAFETY_WARNING",
    severity: "MEDIUM",
    authority: "Kerala State Disaster Management Authority (KSDMA) & Thrissur District Collector",
    officialOrderReference: "KSDMA/TSR/RED-ALERT-CHALAKUDY",
    title: "Monsoon Riverbank Red Alert & Entry Caps",
    description: "High water levels in Chalakudy river trigger safety barricades. Entry to river edge is prohibited, visitor batch sizes are strictly restricted, and hours are curtailed during active rain downpours.",
    isAbsoluteClosure: false,
    // SCOPE: riverbank access and visitor cap. Viewpoint and walkway access varies.
    // penaltyMultiplier 0.65: significant restriction during peak alerts
    penaltyMultiplier: 0.65,
    restrictionScope: "RIVERBANK_ACCESS",
    evidence: {
      sourceUrl: "https://sdma.kerala.gov.in/",
      sourceTitle: "KSDMA — District Disaster Alerts (Thrissur)",
      issuingAuthority: "Kerala State Disaster Management Authority",
      publicationDate: null,
      effectiveFrom: "Triggered by Chalakudy river red-alert level (July–August typically)",
      effectiveTo: null,
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "KSDMA issues periodic red-alerts for Athirappilly; specific advisory URL for the studied period not confirmed."
    }
  },
  {
    id: "disrupt-nohkalikai-fog",
    destinationId: "dest-wf-04",
    destinationName: "Nohkalikai Falls",
    applicableMonths: [6, 7],
    disruptionType: "WEATHER_WARNING",
    severity: "MEDIUM",
    authority: "Meghalaya Tourism Development Corporation (MTDC)",
    officialOrderReference: "MTDC/SOHRA/MONSOON-ADVISORY",
    title: "Zero Visibility Dense Fog & Landslide Advisory",
    description: "Cherrapunji receives torrential rains (>2,000 mm/month) causing persistent cloud cover that often results in 0% waterfall visibility for days at a time. Mudslide risks exist on the Shillong-Sohra bypass.",
    isAbsoluteClosure: false,
    // SCOPE: visibility advisory (not a formal closure). Viewpoint physically accessible.
    // penaltyMultiplier 0.50: severe visibility degradation makes the visit low-value
    penaltyMultiplier: 0.50,
    restrictionScope: "WEATHER_ADVISORY",
    evidence: {
      sourceUrl: "https://www.meghalayatourism.in/",
      sourceTitle: "Meghalaya Tourism — Nohkalikai Falls Visitor Information",
      issuingAuthority: "Meghalaya Tourism Development Corporation (MTDC)",
      publicationDate: null,
      effectiveFrom: "June (monsoon onset)",
      effectiveTo: "July (approximately)",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Fog advisory is consistent with Cherrapunji's documented annual rainfall patterns (IMD normals); official MTDC advisory URL not confirmed."
    }
  },
  {
    id: "disrupt-kedarkantha-monsoon",
    destinationId: "dest-trk-01",
    destinationName: "Kedarkantha Trek",
    applicableMonths: [7, 8],
    disruptionType: "HAZARD_WARNING",
    severity: "HIGH",
    authority: "Uttarakhand State Disaster Management Authority (USDMA)",
    officialOrderReference: "USDMA/UTK/CLOUD-BURST-WARNING",
    title: "Monsoon Cloudburst & Landslide Highway Hazard",
    description: "Trekking is strongly discouraged due to Dehradun-Mussoorie-Sankri road blockages from falling debris, swollen mountain torrents, and continuous flash-flood threat.",
    isAbsoluteClosure: false,
    // SCOPE: access-route hazard warning (not a formal closure of the trail).
    // penaltyMultiplier 0.30: access route severely compromised; trail remains technically open
    penaltyMultiplier: 0.30,
    restrictionScope: "ACCESS_ROUTE_HAZARD",
    evidence: {
      sourceUrl: "https://usdma.uk.gov.in/",
      sourceTitle: "USDMA — Monsoon Landslide Hazard Warnings (Uttarkashi/Sankri Area)",
      issuingAuthority: "Uttarakhand State Disaster Management Authority",
      publicationDate: null,
      effectiveFrom: "July (monsoon season)",
      effectiveTo: "August",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "USDMA issues monsoon hazard warnings for Uttarkashi-Sankri road annually; specific advisory URLs for 2025-26 not confirmed."
    }
  },
  {
    id: "disrupt-triund-monsoon",
    destinationId: "dest-trk-03",
    destinationName: "Triund Trek",
    applicableMonths: [7, 8],
    disruptionType: "ACTIVITY_BAN",
    severity: "HIGH",
    authority: "Kangra District Administration & Dharamshala Police",
    officialOrderReference: "KDA/DHA/CAMP-BAN-MONSOON",
    title: "Monsoon Night Camping Ban & Slippery Ridge Warning",
    description: "Night camping and pitching tents atop Triund ridge is banned during monsoon months due to lightning, high winds, and unstable boulder paths. Day treks permitted only with clear weather clearances.",
    isAbsoluteClosure: false,
    // SCOPE: overnight camping ban only. Day trek access not fully prohibited.
    // penaltyMultiplier 0.40: major activity (camping) banned; day trek still possible
    penaltyMultiplier: 0.40,
    restrictionScope: "CAMPING_ONLY",
    evidence: {
      sourceUrl: "https://hpkangra.nic.in/",
      sourceTitle: "Kangra District Administration — Tourism Guidelines",
      issuingAuthority: "Kangra District Administration",
      publicationDate: null,
      effectiveFrom: "July (monsoon onset)",
      effectiveTo: "August",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Monsoon camping ban at Triund is well-documented; official Kangra district order URL not confirmed."
    }
  },
  {
    id: "disrupt-triund-winter-storm",
    destinationId: "dest-trk-03",
    destinationName: "Triund Trek",
    applicableMonths: [1],
    disruptionType: "SAFETY_WARNING",
    severity: "LOW",
    authority: "Kangra Police & Dharamshala Tourism Police",
    officialOrderReference: "KDA/WINTER/BLIZZARD-ALERT",
    title: "Sub-Zero Ridge Frost Advisory",
    description: "Sudden snowfall may make the '22 Curves' stretch slippery with black ice. Warm layers and descending before 4:00 PM required.",
    isAbsoluteClosure: false,
    // SCOPE: safety advisory only (not a formal closure). Trail physically open.
    // penaltyMultiplier 0.85: low-severity advisory; trail mostly accessible with precautions
    penaltyMultiplier: 0.85,
    restrictionScope: "WEATHER_ADVISORY",
    evidence: {
      sourceUrl: "https://hpkangra.nic.in/",
      sourceTitle: "Kangra District Administration — Winter Trek Advisories",
      issuingAuthority: "Kangra Police / Dharamshala Tourism Police",
      publicationDate: null,
      effectiveFrom: "January (frost season)",
      effectiveTo: "January",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Winter frost advisory for Triund ridge is standard seasonal guidance; official notice URL not confirmed."
    }
  },
  {
    id: "disrupt-chembra-fire",
    destinationId: "dest-trk-04",
    destinationName: "Chembra Peak Trek",
    applicableMonths: [3],
    disruptionType: "SAFETY_WARNING",
    severity: "MEDIUM",
    authority: "Kerala Forest Department (Meppadi Range)",
    officialOrderReference: "KFD/MEPPADI/FIRE-ALERT-03",
    title: "Summer Shola Grassland Fire Hazard Advisory",
    description: "Dry vegetation during peak summer increases wildfire risk. Daily trekker entries are restricted to 200 visitors, and afternoon ascents after 12:00 PM are halted.",
    isAbsoluteClosure: false,
    // SCOPE: entry cap and afternoon ban only. Morning trekking permitted.
    // penaltyMultiplier 0.70: significant restriction but not a full closure
    penaltyMultiplier: 0.70,
    restrictionScope: "ENTRY_CAP_AND_TIME_RESTRICTION",
    evidence: {
      sourceUrl: "https://forest.kerala.gov.in/",
      sourceTitle: "Kerala Forest Department — Meppadi Range Wildfire Advisories",
      issuingAuthority: "Kerala Forest Department (Meppadi Range)",
      publicationDate: null,
      effectiveFrom: "March (peak dry season)",
      effectiveTo: "March",
      lastVerifiedAt: null,
      verificationStatus: "unverified",
      verificationNote: "Summer fire-season entry restrictions for Chembra are documented by Kerala Forest Dept; specific advisory URL not confirmed."
    }
  }
];

export default disruptionsData;
