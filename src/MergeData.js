import dataWeb from "./json/web.json";
import dataMobi from "./json/mobi.json";
import dataExtension from "./json/extension.json";

// Define the languages you want to merge
const languages = ["en", "vi", "zh", "ja", "es"];

// Merge the data from web, mobile, and extension....
const mergedData = Object.keys(dataWeb.common).map((key) => {
  const webItem = {
    key: `common.${key}`,
  };
  languages.forEach((lang) => {
    webItem[lang] = {
      web: dataWeb.common[key][lang],
      mobi: dataMobi.common[key][lang],
      extension: dataExtension.common[key][lang],
    };
  });
  return webItem;
});

export default mergedData;
