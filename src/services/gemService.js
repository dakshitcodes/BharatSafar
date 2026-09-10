import { supabase } from "../lib/supabaseClient";
// Upload hidden gem
export const uploadHiddenGem = async (userId, gemData) => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("hidden_gems")
      .insert({
        submitted_by: userId,
        title: gemData.title,
        description: gemData.description,
        location: gemData.location,
        latitude: gemData.latitude || null,
        longitude: gemData.longitude || null,
        image_url: gemData.image_url || "",
        category: gemData.category || "Other",
        status: "pending",
      })
      .select();

    if (error) {
      console.error("❌ Error uploading gem:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("❌ Exception in uploadHiddenGem:", err);
    return null;
  }
};

// Get approved hidden gems
export const getApprovedGems = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from("hidden_gems")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("❌ Error fetching gems:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Exception in getApprovedGems:", err);
    return [];
  }
};

// Get user's gems
export const getUserGems = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("hidden_gems")
      .select("*")
      .eq("submitted_by", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching user gems:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Exception in getUserGems:", err);
    return [];
  }
};

// Get gem by ID
export const getGemById = async (gemId) => {
  if (!gemId) return null;

  try {
    const { data, error } = await supabase
      .from("hidden_gems")
      .select("*")
      .eq("id", gemId)
      .single();

    if (error) {
      console.error("❌ Error fetching gem:", error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("❌ Exception in getGemById:", err);
    return null;
  }
};
