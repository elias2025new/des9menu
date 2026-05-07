
import { menuData } from '../src/data/menuData.js';

const en = menuData.en;
const am = menuData.am;

console.log("Comparing prices between EN and AM sections...\n");

en.forEach((category, catIdx) => {
    const amCategory = am[catIdx];
    if (!amCategory) {
        console.log(`Missing AM category: ${category.title}`);
        return;
    }
    
    category.items.forEach((item, itemIdx) => {
        const amItem = amCategory.items[itemIdx];
        if (!amItem) {
            console.log(`Missing AM item in ${category.title}: ${item.name}`);
            return;
        }
        
        if (item.price !== amItem.price) {
            console.log(`Price mismatch in ${category.title}:`);
            console.log(`  EN: ${item.name} = ${item.price}`);
            console.log(`  AM: ${amItem.name} = ${amItem.price}`);
            console.log("");
        }
    });
});
