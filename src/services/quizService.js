import { supabase } from "../lib/supabaseClient";

// Save quiz result
export const saveQuizResult = async (
  userId,
  quizType,
  score,
  totalQuestions,
  answers
) => {
  if (!userId) return null;

  try {
    const percentage = (score / totalQuestions) * 100;

    const { data, error } = await supabase
      .from("quiz_results")
      .insert({
        user_id: userId,
        quiz_type: quizType,
        score,
        total_questions: totalQuestions,
        percentage: Math.round(percentage * 100) / 100,
        answers: answers || {},
      })
      .select();

    if (error) {
      console.error("❌ Error saving quiz result:", error);
      return null;
    }

    // Award points to user
    const pointsEarned = Math.round(percentage / 10);
    await updateUserPoints(userId, pointsEarned);

    return data?.[0] || null;
  } catch (err) {
    console.error("❌ Exception in saveQuizResult:", err);
    return null;
  }
};

// Get user quiz history
export const getUserQuizHistory = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching quiz history:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Exception in getUserQuizHistory:", err);
    return [];
  }
};

// Get quiz stats for user
export const getUserQuizStats = async (userId) => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Error fetching quiz stats:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        highest_score: 0,
        average_score: 0,
        total_quizzes: 0,
      };
    }

    const scores = data.map((q) => q.percentage);
    const maxScore = Math.max(...scores);
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );

    return {
      highest_score: maxScore,
      average_score: avgScore,
      total_quizzes: data.length,
    };
  } catch (err) {
    console.error("❌ Exception in getUserQuizStats:", err);
    return null;
  }
};

// Update user points
const updateUserPoints = async (userId, points) => {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        total_points: supabase.rpc("increment_points", {
          p_user_id: userId,
          p_points: points,
        }),
      })
      .eq("id", userId);

    if (error) console.error("❌ Error updating points:", error);
  } catch (err) {
    console.error("❌ Exception in updateUserPoints:", err);
  }
};
