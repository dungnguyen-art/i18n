import { extension_en, en } from "./Js/en";
import { extension_vi, vi } from "./Js/vi";
import { extension_zh, zh } from "./Js/zh";
import { extension_es, es } from "./Js/es";
import { extension_ja, ja } from "./Js/ja";

// Create an empty combined object
const combinedExtension = [];
// Iterate through keys in en.json
for (const sectionKey in en) {
  if (!combinedExtension[sectionKey]) {
    combinedExtension[sectionKey] = {};
  }

  for (const commonKey in en[sectionKey]) {
    combinedExtension[sectionKey][commonKey] = {
      en: en[sectionKey][commonKey],
      vi: vi[sectionKey][commonKey],
      zh: zh[sectionKey][commonKey],
      ja: ja[sectionKey][commonKey],
      es: es[sectionKey][commonKey],
    };
  }
}
export default combinedExtension;
// Convert the combined object to JSON
