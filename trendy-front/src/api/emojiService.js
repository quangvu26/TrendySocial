import axios from "axios";

class EmojiService {
  constructor() {
    this.emojis = [];
  }
  async fetchEmojis() {
    try {
      const res = await axios.get("https://emojihub.yurace.pro/api/all");
      this.emojis = res.data.slice(0, 300).map((item) => ({
        emoji: item.emoji || item.unicode || "😀",
        name: item.name || "emoji",
        category: item.category || "symbols",
        keywords: item.keywords || [],
      }));

      return this.emojis;
    } catch (error) {
      console.error("Failed to fetch emojis from API:", error);
      return [];
    }
  }
  getByCategory(category) {
    return this.emojis.filter((e) => e.category === category);
  }
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
