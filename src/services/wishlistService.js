const WISHLIST_STORAGE_KEY = 'nexbuy_customer_wishlist_v1';

export const wishlistService = {
  async getWishlist(userId) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async addToWishlist(product) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const items = await this.getWishlist();
    if (!items.some((i) => i.id === product.id)) {
      items.push(product);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
    return items;
  },

  async removeFromWishlist(productId) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let items = await this.getWishlist();
    items = items.filter((i) => i.id !== productId);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    return items;
  },

  async isInWishlist(productId) {
    const items = await this.getWishlist();
    return items.some((i) => i.id === productId);
  },
};
