// import { web_en, en } from "./Js/en";
// import { web_vi, vi } from "./Js/vi";
// import { web_zh, zh } from "./Js/zh";
// import { web_es, es } from "./Js/es";
// import { web_ja, ja } from "./Js/ja";

import en from "./Json/en.json";
import vi from "./Json/vi.json";
import zh from "./Json/zh.json";
import es from "./Json/es.json";
import ja from "./Json/ja.json";

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
export default combinedWeb;
// Convert the combined object to JSON
