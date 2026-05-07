/**
 * menuStore.js
 * API-backed menu store. Reads from /api/menu (Neon DB via Vercel).
 * Falls back to the static menuData.js if the API is unreachable.
 */
import { menuData as defaultMenuData } from './menuData';

/** Deep-clone the default data */
function cloneDefault() {
    return JSON.parse(JSON.stringify(defaultMenuData));
}

const SESSION_KEY = 'des9_admin_password';

/** Store the admin password in sessionStorage after login */
export function setAdminPassword(pw) {
    sessionStorage.setItem(SESSION_KEY, pw);
}

export function getAdminPassword() {
    return sessionStorage.getItem(SESSION_KEY) || '';
}

export function clearAdminPassword() {
    sessionStorage.removeItem(SESSION_KEY);
}

// ─── API helpers ───────────────────────────────────────────────────────────────

/** Fetch the current menu from the Neon DB via /api/menu */
export async function fetchMenuFromDB() {
    try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.empty || !json.data) return null; // DB is empty
        return json.data;
    } catch (err) {
        console.warn('fetchMenuFromDB failed, using default:', err);
        return null;
    }
}

/** Save the full menu object to Neon via /api/admin */
export async function saveMenuToDB(menuObj, password) {
    const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password,
        },
        body: JSON.stringify({ data: menuObj }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return true;
}

/** Returns the default menuData (used for DB seeding) */
export function getDefaultMenuData() {
    return cloneDefault();
}

// ─── Local helpers (used for in-memory mutations before saving) ────────────────

export function updateItemPriceLocal(menuObj, categoryId, itemIndex, newPrice) {
    const data = JSON.parse(JSON.stringify(menuObj));
    ['en', 'am'].forEach((lang) => {
        const cat = data[lang]?.find((c) => c.id === categoryId);
        if (cat && cat.items[itemIndex] !== undefined) {
            cat.items[itemIndex].price = newPrice;
        }
    });
    return data;
}


const TRANSLATIONS = {
    'shiro': 'ሽሮ',
    'tibs': 'ጥብስ',
    'kitfo': 'ክትፎ',
    'beyaynetu': 'በያይነቱ',
    'ful': 'ፉል',
    'chechebsa': 'ጨጨብሳ',
    'kinche': 'ቂንጨ',
    'dulet': 'ዱለት',
    'doro': 'ዶሮ',
    'beer': 'ቢራ',
    'coffee': 'ቡና',
    'tea': 'ሻይ',
    'water': 'ውሃ',
    'pizza': 'ፒዛ',
    'burger': 'በርገር',
    'fish': 'ዓሣ',
    'asla': 'አሳ',
    'asa': 'አሳ',
    'special': 'ልዩ',
    'juice': 'ጁስ',
    'honey': 'ማር',
    'egg': 'እንቁላል',
    'meat': 'ስጋ',
    'bread': 'ዳቦ',
    'rice': 'ሩዝ',
    'salad': 'ሰላጣ',
    'wine': 'ወይን',
    'soft drink': 'ለስላሳ መጠጥ',
    'takeaway': 'ፓርሰል',
    'package': 'ፓኬጅ',
    'extra': 'ተጨማሪ',
};

export function smartTranslate(text) {
    if (!text) return '';
    const lower = text.toLowerCase().trim();
    // Check direct match
    if (TRANSLATIONS[lower]) return TRANSLATIONS[lower];
    
    // Check if it contains keywords
    for (const [en, am] of Object.entries(TRANSLATIONS)) {
        if (lower.includes(en)) {
            // Very simple replacement
            return lower.replace(en, am);
        }
    }
    return text; // Fallback to original
}


/** 
 * Adds a new item with potential manual overrides for each language.
 * newItem: { price, image, en: {name, description}, am: {name, description} }
 */
export function addItemToCategoryLocal(menuObj, categoryId, newItem) {
    const data = JSON.parse(JSON.stringify(menuObj));
    ['en', 'am'].forEach((lang) => {
        const cat = data[lang]?.find((c) => c.id === categoryId);
        if (cat) {
            const langData = newItem[lang] || {};
            cat.items.push({
                name: langData.name || '',
                price: newItem.price,
                description: langData.description || '',
                image: newItem.image
            });
        }
    });
    return data;
}

/** 
 * Updates any field of an item (name, price, etc.) across both languages.
 * updateObj: { name, description, price, image } — fields to update for the current lang
 */
export function updateItemDetailsLocal(menuObj, categoryId, itemIndex, lang, updateObj) {
    const data = JSON.parse(JSON.stringify(menuObj));
    
    // 1. Update the specific language version with exactly what was provided
    const targetCat = data[lang]?.find(c => c.id === categoryId);
    if (targetCat && targetCat.items[itemIndex]) {
        targetCat.items[itemIndex] = { ...targetCat.items[itemIndex], ...updateObj };
    }

    // 2. Sync cross-language fields (price and image) to the other language
    const otherLang = lang === 'en' ? 'am' : 'en';
    const otherCat = data[otherLang]?.find(c => c.id === categoryId);
    if (otherCat && otherCat.items[itemIndex]) {
        if (updateObj.price !== undefined) otherCat.items[itemIndex].price = updateObj.price;
        if (updateObj.image !== undefined) otherCat.items[itemIndex].image = updateObj.image;
    }

    return data;
}

export function deleteItemLocal(menuObj, categoryId, itemIndex) {
    const data = JSON.parse(JSON.stringify(menuObj));
    ['en', 'am'].forEach((lang) => {
        const cat = data[lang]?.find((c) => c.id === categoryId);
        if (cat) cat.items.splice(itemIndex, 1);
    });
    return data;
}
