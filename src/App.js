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

  const edit = (record) => {
    form.setFieldsValue({
      ...record, // Initialize the form fields with all fields from the record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();

      // Find the previous data for the edited row
      const previousData = data.find((item) => item.key === key);
      console.log("previousData", previousData);
      console.log("row", row); // Check if the data has changed
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

      setData(newData);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleSave = (editedSingleForm, data, setData) => {
    const newData = data.map((item) => {
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
    console.log("newData in renderUtils", newData);
    setData(newData);
    setEditingKey("");
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
        save={save}
        handleSave={handleSave}
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
