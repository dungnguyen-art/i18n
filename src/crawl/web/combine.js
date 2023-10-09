import { web_en, en } from "./Js/en";
import { web_vi, vi } from "./Js/vi";
import { web_zh, zh } from "./Js/zh";
import { web_es, es } from "./Js/es";
import { web_ja, ja } from "./Js/ja";

// Create an empty combined object
const combinedWeb = [];
console.log("web_en", JSON.parse(web_en));
console.log("web_vi", JSON.parse(web_vi));
console.log("web_zh", JSON.parse(web_zh));
console.log("web_es", JSON.parse(web_es));
console.log("web_ja", JSON.parse(web_ja));
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
export default combinedWeb;
// Convert the combined object to JSON
