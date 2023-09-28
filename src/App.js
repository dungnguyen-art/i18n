import { Form } from "antd";
import { useState, useEffect } from "react";
import mergedData from "./MergeData";
import EditableTable from "./components/EditableTable"; // Import the EditableTable component

const App = () => {
  // State management
  const [form] = Form.useForm();
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("mergedData");
    return storedData ? JSON.parse(storedData) : mergedData;
  });

  const [editingKey, setEditingKey] = useState("");
  // const [useSingleInput, setUseSingleInput] = useState(true); 

  // Functions for handling editing
  const isEditing = (record) => record.key === editingKey;
  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("mergedData", JSON.stringify(data));
  }, [data]);
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
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

  return (
    <EditableTable
      data={data}
      isEditing={isEditing}
      edit={edit}
      save={save}
      cancel={cancel}
      editingKey={editingKey}
      form={form} // Pass form as a prop
      setData={setData}
    />
  );
};

export default App;