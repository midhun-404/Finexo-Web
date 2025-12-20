const STORAGE_KEYS = {
    TRANSACTIONS: 'finexo_transactions',
    RECEIPTS: 'finexo_receipts',
    BUDGETS: 'finexo_budgets',
    GOALS: 'finexo_goals',
    SETTINGS: 'finexo_settings',
    USER_PROFILE: 'finexo_user_profile',
    WARRANTIES: 'finexo_warranties',
    SUBSCRIPTIONS: 'finexo_subscriptions',
    SHARED_SPACES: 'finexo_shared_spaces',
    BADGES: 'finexo_badges'
};

// Helper to get parsed data or default
const getStore = (key, defaultValue = []) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        const parsed = JSON.parse(item);
        return parsed === null ? defaultValue : parsed;
    } catch (e) {
        console.error(`Error reading ${key} from LocalStorage`, e);
        return defaultValue;
    }
};

// Helper to save data
const saveStore = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error(`Error saving ${key} to LocalStorage`, e);
    }
};

export const dbService = {
    // --- Transactions ---
    async addTransaction(transaction) {
        const txs = getStore(STORAGE_KEYS.TRANSACTIONS);
        txs.push(transaction);
        saveStore(STORAGE_KEYS.TRANSACTIONS, txs);
        return transaction;
    },

    async addTransactions(newTransactions) {
        const txs = getStore(STORAGE_KEYS.TRANSACTIONS);
        const updated = [...txs, ...newTransactions];
        saveStore(STORAGE_KEYS.TRANSACTIONS, updated);
        return updated;
    },

    async getAllTransactions() {
        return getStore(STORAGE_KEYS.TRANSACTIONS);
    },

    async deleteTransaction(id) {
        const txs = getStore(STORAGE_KEYS.TRANSACTIONS);
        const updated = txs.filter(t => t.id !== id);
        saveStore(STORAGE_KEYS.TRANSACTIONS, updated);
        return true;
    },

    // --- Receipts ---
    async addReceipt(receipt) {
        const receipts = getStore(STORAGE_KEYS.RECEIPTS);
        receipts.push(receipt);
        saveStore(STORAGE_KEYS.RECEIPTS, receipts);
        return receipt;
    },

    async getAllReceipts() {
        return getStore(STORAGE_KEYS.RECEIPTS);
    },

    async getReceipt(id) {
        const receipts = getStore(STORAGE_KEYS.RECEIPTS);
        return receipts.find(r => r.id === id);
    },

    // --- Warranties (NEW) ---
    async addWarranty(warranty) {
        const items = getStore(STORAGE_KEYS.WARRANTIES);
        items.push(warranty);
        saveStore(STORAGE_KEYS.WARRANTIES, items);
        return warranty;
    },

    async getAllWarranties() {
        return getStore(STORAGE_KEYS.WARRANTIES);
    },

    // --- Subscriptions (NEW) ---
    async updateSubscriptions(subs) {
        saveStore(STORAGE_KEYS.SUBSCRIPTIONS, subs);
        return subs;
    },

    async getSubscriptions() {
        return getStore(STORAGE_KEYS.SUBSCRIPTIONS);
    },

    // --- Budgets ---
    async setBudget(category, amount) {
        const budgets = getStore(STORAGE_KEYS.BUDGETS);
        // Remove existing for this category
        const filtered = budgets.filter(b => b.category !== category);
        filtered.push({ category, amount });
        saveStore(STORAGE_KEYS.BUDGETS, filtered);
        return { category, amount };
    },

    async getAllBudgets() {
        return getStore(STORAGE_KEYS.BUDGETS);
    },

    // --- Goals ---
    async addGoal(goal) {
        const goals = getStore(STORAGE_KEYS.GOALS);
        goals.push(goal);
        saveStore(STORAGE_KEYS.GOALS, goals);
        return goal;
    },

    async getAllGoals() {
        return getStore(STORAGE_KEYS.GOALS);
    },

    // --- Settings / User Profile ---
    async saveSetting(key, value) {
        const settings = getStore(STORAGE_KEYS.SETTINGS, {});
        settings[key] = value;
        saveStore(STORAGE_KEYS.SETTINGS, settings);
        return value;
    },

    async getSetting(key) {
        const settings = getStore(STORAGE_KEYS.SETTINGS, {});
        return settings[key] || null;
    },

    async saveUserProfile(profile) {
        saveStore(STORAGE_KEYS.USER_PROFILE, profile);
        return profile;
    },

    async getUserProfile() {
        return getStore(STORAGE_KEYS.USER_PROFILE, null);
    },

    // --- DANGER: Clear All Data ---
    async clearAllData() {
        localStorage.clear();
        return true;
    }
};
