const ADDRESSES_STORAGE_KEY = 'nexbuy_customer_addresses_v1';

export const addressService = {
  async getAddresses(userId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : [];
      if (userId) {
        return list.filter((a) => a.userId === userId);
      }
      return list;
    } catch {
      return [];
    }
  },

  async getAddressById(id) {
    const list = await this.getAddresses();
    return list.find((a) => a.id === id) || null;
  },

  async addAddress(addressData) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const list = await this.getAddresses(addressData.userId);

    let updatedList = list;
    if (addressData.isDefault || list.length === 0) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }

    const newAddress = {
      ...addressData,
      id: 'addr-' + Date.now(),
      isDefault: addressData.isDefault || list.length === 0,
    };

    updatedList.push(newAddress);
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updatedList));
    return newAddress;
  },

  async updateAddress(id, addressData) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    let list = await this.getAddresses();

    if (addressData.isDefault) {
      list = list.map((a) => ({ ...a, isDefault: false }));
    }

    list = list.map((a) => {
      if (a.id === id) {
        return { ...a, ...addressData };
      }
      return a;
    });

    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
    return list.find((a) => a.id === id);
  },

  async deleteAddress(id) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    let list = await this.getAddresses();
    const toDelete = list.find((a) => a.id === id);
    list = list.filter((a) => a.id !== id);

    if (toDelete?.isDefault && list.length > 0) {
      list[0].isDefault = true;
    }

    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
    return true;
  },

  async setDefaultAddress(id) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let list = await this.getAddresses();
    list = list.map((a) => ({ ...a, isDefault: a.id === id }));
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
    return list;
  },
};
