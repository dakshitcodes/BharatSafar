import { supabase } from "../lib/supabaseClient";

// Add bookmark
export const addBookmark = async (userId, gemId, gemData) => {
  if (!userId || !gemId) return null;

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: userId,
        gem_id: gemId,
        title: gemData.title || "Unknown",
        description: gemData.description || "",
        image_url: gemData.image_url || "",
        location: gemData.location || "",
      })
      .select();

    if (error) {
      console.error("❌ Error adding bookmark:", error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error("❌ Exception in addBookmark:", err);
    return null;
  }
};

// Get user bookmarks
export const getUserBookmarks = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("bookmarked_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching bookmarks:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Exception in getUserBookmarks:", err);
    return [];
  }
};

// Delete bookmark
export const deleteBookmark = async (bookmarkId) => {
  if (!bookmarkId) return false;

  try {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmarkId);

    if (error) {
      console.error("❌ Error deleting bookmark:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Exception in deleteBookmark:", err);
    return false;
  }
};

// Check if gem is bookmarked
export const isGemBookmarked = async (userId, gemId) => {
  if (!userId || !gemId) return false;

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("gem_id", gemId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error checking bookmark:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("❌ Exception in isGemBookmarked:", err);
    return false;
  }
};
