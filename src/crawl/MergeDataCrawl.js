import combinedMobi from "./mobile/combine";
import combinedWeb from "./web/combine";
import combinedExtension from "./extension/combine";

// Define the languages you want to merge
const languages = ["en", "vi", "zh", "ja", "es"];

// Create an empty array to store the merged data
const MergeDataCrawl = [];

// Iterate through keys in combinedWeb (assuming it's the base structure)
for (const key1 in combinedWeb) {
  for (const key2 in combinedWeb[key1]) {
    const mergedItem = {
      key: `${key1}.${key2}`,
    };

    // Iterate through the specified languages and merge translations
    languages.forEach((lang) => {
      mergedItem[lang] = {
        web: combinedWeb[key1][key2][lang],
        mobi: combinedMobi[key1][key2][lang],
        extension: combinedExtension[key1][key2][lang],
      };
    });

    MergeDataCrawl.push(mergedItem);
  }
}

export default MergeDataCrawl;
