import { en } from "./en";
import { vi } from "./vi";
import {  zh } from "./zh";
import {  es } from "./es";
import {  ja } from "./ja";


// Create an empty combined object
const combinedWeb = [];

// Iterate through keys in en.json
for (const sectionKey in en) {
  if (!combinedWeb[sectionKey]) {
    combinedWeb[sectionKey] = {};
  }

  for (const commonKey in en[sectionKey]) {
    combinedWeb[sectionKey][commonKey] = {
        en: en[sectionKey][commonKey],
        vi: vi[sectionKey][commonKey],
        zh: zh[sectionKey][commonKey],
        ja: ja[sectionKey][commonKey],
        es: es[sectionKey][commonKey],
    };
  }
}
export default combinedWeb
// Convert the combined object to JSON