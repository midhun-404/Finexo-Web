import { openDB } from 'idb';

const DB_NAME = 'finexo_db';
const DB_VERSION = 2; // Incremented version

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
            // v1 Stores (ensure they exist if upgrading from scratch)
            if (!db.objectStoreNames.contains('transactions')) {
                const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
                txStore.createIndex('date', 'date');
                txStore.createIndex('type', 'type');
                txStore.createIndex('category', 'category');
            }
            if (!db.objectStoreNames.contains('budgets')) {
                db.createObjectStore('budgets', { keyPath: 'category' });
            }
            if (!db.objectStoreNames.contains('goals')) {
                db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }

            // v2 Stores (New Features)
            if (!db.objectStoreNames.contains('receipts')) {
                const receiptStore = db.createObjectStore('receipts', { keyPath: 'id' });
                receiptStore.createIndex('createdAt', 'createdAt');
            }
            if (!db.objectStoreNames.contains('merchants')) {
                db.createObjectStore('merchants', { keyPath: 'merchant_token' });
            }
            if (!db.objectStoreNames.contains('snapshots')) {
                db.createObjectStore('snapshots', { keyPath: 'month' });
            }
            if (!db.objectStoreNames.contains('sharedSpaces')) {
                db.createObjectStore('sharedSpaces', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('badges')) {
                db.createObjectStore('badges', { keyPath: 'id' });
            }
        },
    });
};

export const dbService = {
    // --- Transactions ---
    async addTransaction(transaction) {
        const db = await initDB();
        return db.put('transactions', transaction);
    },

    async addTransactions(transactions) {
        const db = await initDB();
        const tx = db.transaction('transactions', 'readwrite');
        await Promise.all(transactions.map(t => tx.store.put(t)));
        await tx.done;
    },

    async getAllTransactions() {
        const db = await initDB();
        return db.getAll('transactions');
    },

    async deleteTransaction(id) {
        const db = await initDB();
        return db.delete('transactions', id);
    },

    // --- Receipts ---
    async addReceipt(receipt) {
        const db = await initDB();
        return db.put('receipts', receipt);
    },

    async getAllReceipts() {
        const db = await initDB();
        return db.getAll('receipts');
    },

    async getReceipt(id) {
        const db = await initDB();
        return db.get('receipts', id);
    },

    // --- Budgets ---
    async setBudget(category, amount) {
        const db = await initDB();
        return db.put('budgets', { category, amount });
    },

    async getAllBudgets() {
        const db = await initDB();
        return db.getAll('budgets');
    },

    // --- Goals ---
    async addGoal(goal) {
        const db = await initDB();
        return db.put('goals', goal);
    },

    async getAllGoals() {
        const db = await initDB();
        return db.getAll('goals');
    },

    // --- Settings / User Data ---
    async saveSetting(key, value) {
        const db = await initDB();
        return db.put('settings', { key, value });
    },

    async getSetting(key) {
        const db = await initDB();
        const result = await db.get('settings', key);
        return result ? result.value : null;
    },

    // --- DANGER: Clear All Data ---
    async clearAllData() {
        const db = await initDB();
        const storeNames = db.objectStoreNames;
        const tx = db.transaction(storeNames, 'readwrite');

        for (const storeName of storeNames) {
            await tx.objectStore(storeName).clear();
        }

        await tx.done;
        localStorage.clear();
        return true;
    }
};
