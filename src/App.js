import { Form } from "antd";
import { useState, useEffect } from "react";
import mergedData from "./MergeData";
import EditableTable from "./components/EditableTable"; // Import the EditableTable component
import { EditedSingleFormProvider } from "./components/EditedSingleFormContext";
import "./App.css";
// import MergeDataCrawl from "./crawl/MergeDataCrawl";
import {MergeDataCrawl2} from "./crawl/fetchFromGithub";

const App = () => {
  // State management
  const [form] = Form.useForm();
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("mergedData");
    return storedData ? JSON.parse(storedData) : MergeDataCrawl2;
  });
  const [editingKey, setEditingKey] = useState("");
  // State to track edited rows
  const [editedRows, setEditedRows] = useState([]);
  // Functions for handling editing
  const isEditing = (record) => record.key === editingKey;
  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("mergedData", JSON.stringify(data));
  }, [data]);


  // const createDataToStrapi = async (record) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:1338/api/i18n-v3s`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json", 
  //         },
  //         body: JSON.stringify(record),
  //       }
  //     );
  
  //     if (response.ok) {
  //       const createdData = await response.json();
  //       console.log(`Data created in Strapi:`, createdData);
  //     } else {
  //       console.error(`Failed to create data in Strapi`);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  
  // useEffect(() => {
  //   for (const key in MergeDataCrawl) {
  //     if (MergeDataCrawl.hasOwnProperty(key)) {
  //       const record = MergeDataCrawl[key];
  //       const refactorData = {
  //         "data": {}
  //       };
  //       refactorData.data = record
  //       createDataToStrapi(refactorData);
  //     }
  //   }
  // }, [MergeDataCrawl]); 

  const fetchDataFromStrapi = async () => {
    try {
      const response = await fetch("http://localhost:1338/api/i18n-v3s");
      const dataStrapi = await response.json();
      console.log("dataStrapi", dataStrapi);

      // Process the data as needed
      // Extract the keys from mergedData
      const mergedDataKeys = Object.keys(mergedData[0]);
      console.log("mergedDataKeys", mergedDataKeys);
      // mergedDataKeys.push("platform");

      // // Restructure dataStrapi to match the structure of mergedData and remove extra keys
      const restructuredDataStrapi = dataStrapi.data.map((item) => {
        const key = item.attributes.key;
        const languages = {};
        // Loop through the language keys from mergedData and extract matching language data
        mergedDataKeys.forEach((langKey) => {
          if (item.attributes[langKey]) {
            languages[langKey] = item.attributes[langKey];
          }
        });

        return {
          id: item.id,
          key,
          ...languages,
        };
      });
      // Update the 'data' state with the fetched data
      console.log("restructuredDataStrapi", restructuredDataStrapi);
      setData(restructuredDataStrapi);

      // Handle any errors that may occur during the fetch
    } catch (error) {
      console.error("Error fetching data from Strapi:", error);
    }
  };
  // useEffect(() => {
    // Fetch data from Strapi when the component mounts
    fetchDataFromStrapi();
  // }, []); // Empty dependency array to fetch data only on mount

  // Import the fetchDataGithub function if it's defined in a separate module

  // const fetchDataGithub = async (url) => {
  //   try {
  //     const response = await fetch(url);

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.text();
  //     return data;
  //   } catch (error) {
  //     console.error("There was a problem fetching the data:", error);
  //     throw error; // Re-throw the error to handle it later if needed
  //   }
  // };

  // const fetchAllData = async () => {
  //   const url_en =
  //     "https://raw.githubusercontent.com/Koniverse/SubWallet-Mobile/master/src/utils/i18n/en_US.ts";
  //   const url_vi =
  //     "https://raw.githubusercontent.com/Koniverse/SubWallet-Mobile/master/src/utils/i18n/vi_VN.ts";
  //   const url_zh =
  //     "https://raw.githubusercontent.com/Koniverse/SubWallet-Mobile/master/src/utils/i18n/zh_CN.ts";

  //   try {

  //     const mobi_en = await fetchDataGithub(url_en);
  //     const mobi_vi = await fetchDataGithub(url_vi);
  //     const mobi_zh = await fetchDataGithub(url_zh);

  //     const cleanedMobiEn = JSON.stringify(mobi_en).replace(
  //       /export const en =/,
  //       ""
  //     );
  //     const cleanedMobiVi = JSON.stringify(mobi_vi).replace(
  //       /export const vi =/,
  //       ""
  //     );
  //     const cleanedMobiZh = JSON.stringify(mobi_zh).replace(
  //       /export const zh =/,
  //       ""
  //     );

  //     // Convert cleaned data to JSON objects
  //     const jsonDataEn = JSON.parse(cleanedMobiEn);
  //     const jsonDataVi = JSON.parse(cleanedMobiVi);
  //     const jsonDataZh = JSON.parse(cleanedMobiZh);
  //     console.log("jsonDataEn: ", jsonDataEn);
  //   } catch (error) {
  //     // Handle errors here if needed
  //     console.error("Error:", error);
  //   }
  // };

  // Call the fetchAllData function to fetch and process the data
  // fetchAllData();

  const edit = (record) => {
    form.setFieldsValue({
      ...record, // Initialize the form fields with all fields from the record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleSave = async (
    editedSingleForm,
    data,
    setData,
    key,
    isParentData = false
  ) => {
    try {
      console.log(`handleSave called! -> parentData==${isParentData}`);
      console.log("data", data);
      const row = await form.validateFields();
      console.log("row", row);

      // Find the previous data for the edited row
      const previousData = data.find((item) => item.key === key);

      function areAllValuesEqual(row, previousData) {
        for (const language in row) {
          if (
            row.hasOwnProperty(language) &&
            row[language]["web"] === previousData[language]["web"] &&
            row[language]["mobi"] === previousData[language]["mobi"] &&
            row[language]["extension"] === previousData[language]["extension"]
          ) {
            continue;
          } else {
            return false;
          }
        }
        return true;
      }

      // Check if all values in "row" are equal to "previousData"
      const result = areAllValuesEqual(row, previousData);

      if (!result) {
        // Data has changed, update the edited row's isEdited flag
        previousData.isEdited = true;
        // Add the edited row's key to the editedRows state
        setEditedRows([...editedRows, key]);
      }

      const newData = data.map((item) => {
        if (item.key === key) {
          return { ...item, ...row };
        }
        return item;
      });
      // if (isParentData) {
      const updatedData = newData.map((item) => {
        const editedItem = editedSingleForm[item.key];

        if (editedItem) {
          const isEdited = Object.keys(editedItem).some((language) =>
            ["web", "mobi", "extension"].some(
              (property) =>
                editedItem[language] &&
                editedItem[language][property] !== item[language][property]
            )
          );

          if (isEdited) {
            item.isEdited = true;
            setEditedRows([...editedRows, item.key]);
          }

          return {
            ...item,
            ...editedItem,
          };
        }

        return item;
      });
      setData(updatedData);

      // PUT method: Send a PUT request to update the data in Strapi
      const updatedDataStrapi = updatedData.map((item) => {
        const languages = Object.keys(item).filter(
          (key) => key !== "id" && key !== "key" && key !== "isEdited"
        );
        const data = {
          key: item.key,
        };

        languages.forEach((language) => {
          data[language] = {
            web: item[language].web,
            mobi: item[language].mobi,
            extension: item[language].extension,
          };
        });

        return {
          id: item.id,
          data: data,
        };
      });

      const putDataToStrapi = async (updatedDataStrapi) => {
        try {
          for (const id in updatedDataStrapi) {
            if (updatedDataStrapi.hasOwnProperty(id)) {
              const dataToUpdate = updatedDataStrapi[id];

              const idx = dataToUpdate.id;
              delete dataToUpdate.id;
              const response = await fetch(
                `http://localhost:1338/api/i18n-v3s/${idx}`, // Make sure to use the correct URL
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                  },
                  body: JSON.stringify(dataToUpdate), // Convert data to JSON string
                }
              );

              if (response.ok) {
                console.log(`Data with ID ${idx} updated in Strapi`);
              } else {
                console.error(`Failed to update data with ID ${idx} in Strapi`);
              }
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      putDataToStrapi(updatedDataStrapi);

      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const getRowClassName = (record) => {
    return editedRows.includes(record.key) ? "edited-row" : "";
  };
  
  console.log("MergeDataCrawl2", MergeDataCrawl2);
  return (
    <EditedSingleFormProvider>
      <EditableTable
        data={data}
        isEditing={isEditing}
        edit={edit}
        save={handleSave}
        cancel={cancel}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
        form={form} // Pass form as a prop
        setData={setData}
        getRowClassName1={getRowClassName}
      />
    </EditedSingleFormProvider>
  );
};
export default App;
