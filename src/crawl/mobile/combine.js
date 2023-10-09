import { mobi_en, en } from "./Js/en";
import { mobi_vi, vi } from "./Js/vi";
import { mobi_zh, zh } from "./Js/zh";
import { mobi_es, es } from "./Js/es";
import { mobi_ja, ja } from "./Js/ja";

// Create an empty combined array
const combinedMobi = [];
// Iterate through keys in en.json
for (const sectionKey in en) {
  if (!combinedMobi[sectionKey]) {
    combinedMobi[sectionKey] = {};
  }

  for (const commonKey in en[sectionKey]) {
    combinedMobi[sectionKey][commonKey] = {
        en: en[sectionKey][commonKey],
        vi: vi[sectionKey][commonKey],
        zh: zh[sectionKey][commonKey],
        ja: ja[sectionKey][commonKey],
        es: es[sectionKey][commonKey],
    };
  }
}


export default combinedMobi;