import { Form } from "antd";
import { useState, useEffect } from "react";
import mergedData from "./MergeData";
import EditableTable from "./components/EditableTable"; // Import the EditableTable component
import { EditedSingleFormProvider } from "./components/EditedSingleFormContext";
import "./App.css";

const App = () => {
  // State management
  const [form] = Form.useForm();
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("mergedData");
    return storedData ? JSON.parse(storedData) : mergedData;
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

  const fetchDataFromStrapi = async () => {
    try {
      const response = await fetch("http://localhost:1338/api/i18ns/");
      const dataStrapi = await response.json();
      console.log("dataStrapi", dataStrapi);

      // Process the data as needed
      // For example, you may need to transform it to match your table structure
      // Extract the keys from mergedData
      const mergedDataKeys = Object.keys(mergedData[0]);

      // Restructure dataStrapi to match the structure of mergedData and remove extra keys
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
      console.log("restructuredDataStrapi", restructuredDataStrapi);
      // Update the 'data' state with the fetched data
      setData(restructuredDataStrapi);

      // Handle any errors that may occur during the fetch
    } catch (error) {
      console.error("Error fetching data from Strapi:", error);
    }
  };

  useEffect(() => {
    // Fetch data from Strapi when the component mounts
    fetchDataFromStrapi();
  }, []); // Empty dependency array to fetch data only on mount

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
      console.log("newData", newData);
      // if (isParentData) {
      const updatedData = newData.map((item) => {
        const editedItem = editedSingleForm[item.key];
        console.log("editedItem", editedItem);

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
      console.log("updatedData", updatedData);
      setData(updatedData);
      // } else {
      // setData(newData);
      // }

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
      />
    </EditedSingleFormProvider>
  );
};
export default App;
