import axios from "axios";

class EmojiService {
  constructor() {
    this.emojis = [];
  }

  /**
   * Fetch emojis từ API
   */
  async fetchEmojis() {
    try {
      console.log("📥 Fetching emojis from API...");
      const res = await axios.get("https://emojihub.yurace.pro/api/all");
      console.log("✅ Loaded emojis:", res.data.length);

      // Transform API data to our format
      this.emojis = res.data.slice(0, 300).map((item) => ({
        emoji: item.emoji || item.unicode || "😀",
        name: item.name || "emoji",
        category: item.category || "symbols",
        keywords: item.keywords || [],
      }));

      console.log("✅ Emojis formatted:", this.emojis.length);
      return this.emojis;
    } catch (error) {
      console.error("Failed to fetch emojis from API:", error);
      return [];
    }
  }

  /**
   * Get emojis by category
   */
  getByCategory(category) {
    return this.emojis.filter((e) => e.category === category);
  }

  /**
   * Search emojis
   */
  search(query) {
    if (!query) return this.emojis;
    const q = query.toLowerCase();
    return this.emojis.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }
}

export default new EmojiService();
