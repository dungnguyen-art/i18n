//  Import the fetchDataGithub function if it's defined in a separate module
const fetchDataGithub = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem fetching the data:", error);
    throw error; // Re-throw the error to handle it later if needed
  }
};

const fetchAllData = async () => {
  // Get all URL gihub the data extensions
  const url_extension_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/Json/en.json";
  const url_extension_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/Json/es.json";
  const url_extension_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/Json/vi.json";
  const url_extension_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/Json/zh.json";
  const url_extension_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/Json/ja.json";
  // Get all URL the data web
  const url_web_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/Json/en.json";
  const url_web_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/Json/es.json";
  const url_web_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/Json/vi.json";
  const url_web_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/Json/zh.json";
  const url_web_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/Json/ja.json";
  // Get all URL the data mobi
  const url_mobi_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/Json/en.json";
  const url_mobi_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/Json/es.json";
  const url_mobi_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/Json/vi.json";
  const url_mobi_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/Json/zh.json";
  const url_mobi_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/Json/ja.json";

  try {
    // Get all data extension
    const data_extension_en = await fetchDataGithub(url_extension_en);
    const data_extension_es = await fetchDataGithub(url_extension_es);
    const data_extension_vi = await fetchDataGithub(url_extension_vi);
    const data_extension_zh = await fetchDataGithub(url_extension_zh);
    const data_extension_ja = await fetchDataGithub(url_extension_ja);

    const combinedExtension = [];
    // Iterate through keys in en.json
    for (const sectionKey in data_extension_en) {
      if (!combinedExtension[sectionKey]) {
        combinedExtension[sectionKey] = {};
      }

      for (const commonKey in data_extension_en[sectionKey]) {
        combinedExtension[sectionKey][commonKey] = {
          en: data_extension_en[sectionKey][commonKey],
          vi: data_extension_vi[sectionKey][commonKey],
          zh: data_extension_zh[sectionKey][commonKey],
          ja: data_extension_ja[sectionKey][commonKey],
          es: data_extension_es[sectionKey][commonKey],
        };
      }
    }

    console.log("combinedExtension", combinedExtension);

    // Get all data web
    const data_web_en = await fetchDataGithub(url_web_en);
    const data_web_es = await fetchDataGithub(url_web_es);
    const data_web_vi = await fetchDataGithub(url_web_vi);
    const data_web_zh = await fetchDataGithub(url_web_zh);
    const data_web_ja = await fetchDataGithub(url_web_ja);

    // Create an empty combined object
    const combinedWeb = [];
    // Iterate through keys in en.json
    for (const sectionKey in data_web_en) {
      if (!combinedWeb[sectionKey]) {
        combinedWeb[sectionKey] = {};
      }

      for (const commonKey in data_web_en[sectionKey]) {
        combinedWeb[sectionKey][commonKey] = {
          en: data_web_en[sectionKey][commonKey],
          vi: data_web_vi[sectionKey][commonKey],
          zh: data_web_zh[sectionKey][commonKey],
          ja: data_web_ja[sectionKey][commonKey],
          es: data_web_es[sectionKey][commonKey],
        };
      }
    }

    console.log("combinedWeb", combinedWeb);
    // Get all data mobi
    const data_mobi_en = await fetchDataGithub(url_mobi_en);
    const data_mobi_es = await fetchDataGithub(url_mobi_es);
    const data_mobi_vi = await fetchDataGithub(url_mobi_vi);
    const data_mobi_zh = await fetchDataGithub(url_mobi_zh);
    const data_mobi_ja = await fetchDataGithub(url_mobi_ja);

    // Create an empty combined array
    const combinedMobi = [];
    // Iterate through keys in en.json
    for (const sectionKey in data_mobi_en) {
      if (!combinedMobi[sectionKey]) {
        combinedMobi[sectionKey] = {};
      }

      for (const commonKey in data_mobi_en[sectionKey]) {
        combinedMobi[sectionKey][commonKey] = {
          en: data_mobi_en[sectionKey][commonKey],
          vi: data_mobi_vi[sectionKey][commonKey],
          zh: data_mobi_zh[sectionKey][commonKey],
          ja: data_mobi_ja[sectionKey][commonKey],
          es: data_mobi_es[sectionKey][commonKey],
        };
      }
    }
    console.log("combinedMobi", combinedMobi);

    // MergeDataGithub
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
    return MergeDataCrawl
  } catch (error) {
    // Handle errors here if needed
    console.error("Error:", error);
  }
};

//   Call the fetchAllData function to fetch and process the data
export const MergeDataCrawl2 = await fetchAllData();
