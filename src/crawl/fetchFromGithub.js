//  Import the fetchDataGithub function if it's defined in a separate module
import {extension_zh} from "./extension/Js/zh"
const fetchDataGithub = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("There was a problem fetching the data:", error);
    throw error; // Re-throw the error to handle it later if needed
  }
};

const fetchAllData = async () => {
  // Get all URL gihub the data extensions
  const url_extension_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/en.js";
  const url_extension_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/es.js";
  const url_extension_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/vi.js";
  const url_extension_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/zh.js";
  const url_extension_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/extension/ja.js";
  // Get all URL the data web
  const url_web_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/en.js";
  const url_web_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/es.js";
  const url_web_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/vi.js";
  const url_web_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/zh.js";
  const url_web_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/web/ja.js";
  // Get all URL the data mobi
  const url_mobi_en =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/en.js";
  const url_mobi_es =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/es.js";
  const url_mobi_vi =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/vi.js";
  const url_mobi_zh =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/zh.js";
  const url_mobi_ja =
    "https://raw.githubusercontent.com/dungnguyen-art/i18n/main/src/crawl/mobile/ja.js";

  try {
    // Get all data extension
    // const data_extension_en = await fetchDataGithub(url_extension_en);
    // const data_extension_es = await fetchDataGithub(url_extension_es);
    // const data_extension_vi = await fetchDataGithub(url_extension_vi);
    // const data_extension_zh = await fetchDataGithub(url_extension_zh);
    // const data_extension_ja = await fetchDataGithub(url_extension_ja);
    // Get all data web
    // const data_web_en = await fetchDataGithub(url_web_en);
    // const data_web_es = await fetchDataGithub(url_web_es);
    // const data_web_vi = await fetchDataGithub(url_web_vi);
    // const data_web_zh = await fetchDataGithub(url_web_zh);
    // const data_web_ja = await fetchDataGithub(url_web_ja);

    // console.log("data_web_zh", data_web_zh);
    // Get all data mobi
    // const modifiedTextResponse = data_web_zh.replace("export const zh = ", "");
    // console.log("modifiedTextResponse:", modifiedTextResponse);
    console.log("extension_zh:", typeof (extension_zh));
    const obj = JSON.parse(extension_zh)
    console.log("obj", obj);


    // Replace single quotes with double quotes for keys and string values
    // const validJsonText = modifiedTextResponse.replace(/'([^']+)'/g, '"$1"');
    // console.log("validJsonText", validJsonText);

    // Parse the modified text into a JSON object
    // const jsonObject = JSON.parse(validJsonText);

    // Now you can work with the JSON object
    // console.log("JSON Object:", jsonObject);
  } catch (error) {
    // Handle errors here if needed
    console.error("Error:", error);
  }
};

//   Call the fetchAllData function to fetch and process the data
export default fetchAllData();
