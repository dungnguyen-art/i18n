import { Form } from "antd";
import { useState, useEffect } from "react";
import EditableTable from "./components/EditableTable";
import { EditedSingleFormProvider } from "./components/EditedSingleFormContext";
import "./App.css";
// const token =
// "096ff9f4305ea99d58c85125d073c6cc09230dd234c5072b31d79743376444e2031db6c60ecf3ce9e7def98afae2fe5c1625bc14a5b7b7d8f1ca694c724604702584af4d9e6b75fead0bc2a5ab5253dbbebd3ce03ee82551c49e206df3000d9b1170d49741b3cbc5bbddb08143558494b48a668250f54fb02b0b20951ad0f2ea";
// let token = "";
const App = () => {
  // State management
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [editedRows, setEditedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [token, setToken] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Use the searchValue in the App component
    console.log("Search submitted:", searchValue);
    // token = searchValue;
    // console.log("token in handleSubmit", token);
    setToken(searchValue)
  };
  console.log("token", token);
  async function fetchAllRecords() {
    const recordsPerPage = 50; // Number of records to fetch per request
    let allRecords = [];
    let currentPage = 0;
    console.log("token", token);

    while (true) {
      const response = await fetch(
        `http://localhost:1337/api/i18ns?populate=*&pagination[start]=${currentPage}&pagination[limit]=${recordsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        break;
      }

      const dataStrapi = await response.json();

      if (dataStrapi.data.length === 0) {
        break;
      }

      allRecords = allRecords.concat(dataStrapi.data);
      currentPage += recordsPerPage;
    }
    return allRecords;
  }

  useEffect(() => {
    const fetchDataFromStrapi = async () => {
      try {
        const dataStrapi = await fetchAllRecords();
        const mergedDataKeys = ["en", "vi", "zh", "ja", "ru"];
        const restructuredDataStrapi = dataStrapi.map((item) => {
          const key = item.attributes.key;
          const languages = {};
          mergedDataKeys.forEach((langKey) => {
            if (item.attributes[langKey]) {
              languages[langKey] = {
                web: item.attributes[langKey].web || null,
                mobi: item.attributes[langKey].mobi || null,
                extension: item.attributes[langKey].extension || null,
              };
            }
          });

          return {
            id: item.id,
            key,
            ...languages,
          };
        });
        setData(restructuredDataStrapi);
      } catch (error) {
        console.error("Error fetching data from Strapi:", error);
      }
    };
    fetchDataFromStrapi();
  }, [token]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record, // Initialize the form fields with all fields from the record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleSave = async (editedSingleForm, data, setData, key) => {
    try {
      const row = await form.validateFields();
      for (const langCode in row) {
        if (langCode !== "key") {
          const lang = row[langCode];
          // Check if only one field exists in the language
          const fieldCount = Object.keys(row[langCode]).length;
          if (fieldCount === 1) {
            // Get the existing value
            const existingValue = Object.values(lang).find(
              (value) => value !== null
            );

            // Update all three fields
            lang.web = existingValue;
            lang.mobi = existingValue;
            lang.extension = existingValue;
          }
        }
      }

      // Find the previous data for the edited row
      const previousData = data.find((item) => item.key === key);
      row["id"] = previousData.id;
      row["key"] = previousData.key;

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

      const putDataToStrapi = async (row) => {
        try {
          const idx = row.id;
          delete row.id;
          const record = {};
          record["data"] = row;
          const response = await fetch(
            `http://localhost:1337/api/i18ns/${idx}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(record),
            }
          );

          if (response.ok) {
            console.log(`Data with ID ${idx} updated in Strapi`);
          } else {
            console.error(`Failed to update data with ID ${idx} in Strapi`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      putDataToStrapi(row);

      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const getRowClassName = (record) => {
    return editedRows.includes(record.key) ? "edited-row" : "";
  };

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
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
    </EditedSingleFormProvider>
  );
};
export default App;
