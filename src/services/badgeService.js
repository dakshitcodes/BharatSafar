import { supabase } from "../lib/supabaseClient";

// Check and award badges based on quiz performance
export const checkAndAwardBadges = async (userId, quizStats) => {
  if (!userId || !quizStats) return [];

  try {
    const awardedBadges = [];

    // Bronze Badge: Complete 1 quiz
    if (quizStats.total_quizzes === 1) {
      const badge = await awardBadge(
        userId,
        "bronze",
        "🥉 Bronze Badge",
        "Complete 1 quiz"
      );
      if (badge) awardedBadges.push(badge);
    }

    // Silver Badge: Complete 5 quizzes
    if (quizStats.total_quizzes === 5) {
      const badge = await awardBadge(
        userId,
        "silver",
        "🥈 Silver Badge",
        "Complete 5 quizzes"
      );
      if (badge) awardedBadges.push(badge);
    }

    // Gold Badge: Complete 10 quizzes
    if (quizStats.total_quizzes === 10) {
      const badge = await awardBadge(
        userId,
        "gold",
        "🥇 Gold Badge",
        "Complete 10 quizzes"
      );
      if (badge) awardedBadges.push(badge);
    }

    // Perfect Score Badge: 100% on any quiz
    if (quizStats.highest_score === 100) {
      const badge = await awardBadge(
        userId,
        "perfect",
        "⭐ Perfect Score",
        "Score 100% on a quiz"
      );
      if (badge) awardedBadges.push(badge);
    }

    return awardedBadges;
  } catch (err) {
    console.error("❌ Exception in checkAndAwardBadges:", err);
    return [];
  }
};

// Award single badge
const awardBadge = async (userId, badgeName, badgeIcon, description) => {
  try {
    const { data, error } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_name: badgeName,
        badge_icon: badgeIcon,
        description: description,
      })
      .select();

    if (error) {
      console.error("❌ Error awarding badge:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("❌ Exception in awardBadge:", err);
    return null;
  }
};

// Get user badges
export const getUserBadges = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_date", { ascending: false });

    if (error) {
      console.error("❌ Error fetching badges:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Exception in getUserBadges:", err);
    return [];
  }
};
