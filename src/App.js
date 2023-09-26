import {Form} from "antd";
import { useState } from "react"
import mergedData from "./MergeData"
import EditableTable from './components/EditableTable'; // Import the EditableTable component


const App = () => {
  // State management
  const [form] = Form.useForm();
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("mergedData");
    return storedData ? JSON.parse(storedData) : mergedData;
  });

  const [editingKey, setEditingKey] = useState("");
  // Functions for handling editing
  const isEditing = (record) => record.key === editingKey;

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
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        console.log('loglog', item);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        localStorage.setItem("mergedData", JSON.stringify(newData)); // Store data in localStorage
        setEditingKey("");
      } else {
        newData.push(row);
        localStorage.setItem("mergedData", JSON.stringify(newData)); // Store data in localStorage
        setData(newData);
        setEditingKey("");
      }
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
    />
  );
};

export default App;
