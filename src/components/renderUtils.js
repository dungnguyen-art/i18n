import React, { useState, useCallback, useEffect } from "react";
import EditableCell from "./EditableCell";
import { Input, Switch } from "antd";
import { useEditedSingleForm } from "./EditedSingleFormContext";
import { debounce } from "lodash";

const renderEditableCell = (
  record,
  dataIndex,
  title,
  inputType,
  isEditing,
  updateAllFields
) => (
  <EditableCell
    editing={isEditing}
    dataIndex={dataIndex}
    title={title}
    inputType={inputType}
    record={record}
    updateAllFields={updateAllFields}
  />
);

export const Render = ({
  record,
  dataIndex,
  isEditing,
  setData,
  data,
  updateParentData,
  setParentData,
}) => {
  return (
    <>
      {/* Other components */}
      <RenderTranslatedCell
        record={record}
        dataIndex={dataIndex}
        isEditing={isEditing}
        setData={setData}
        data={data}
        updateParentData={updateParentData}
        setParentData={setParentData}
      />
    </>
  );
};

// export const handleSave = (editedSingleForm, data, setData) => {
//   const updatedData = data.map((item) => {
//     const editedItem = editedSingleForm[item.key];
//     console.log('editedItem', editedItem);

//     if (editedItem) {
//       return {
//         ...item,
//         ...editedItem,
//       };
//     }
//     return item;
//   });
//   console.log("data in renderUtils", data);
//   setData(updatedData);
// };

const RenderTranslatedCell = ({
  record,
  dataIndex,
  isEditing,
  setData,
  data,
  updateParentData,
  setParentData,
}) => {
  const { web, mobi, extension } = record[dataIndex];
  const allEqual = web === mobi && mobi === extension;
  const { editedSingleForm, setEditedSingleForm } = useEditedSingleForm();
  const [singleInput, setSingleInput] = useState(allEqual);
  useEffect(() => {
    updateParentData(singleInput);
  }, [singleInput]);

  const toggleInputMode = () => {
    setSingleInput((prevMode) => !prevMode);
    // updateParentData(singleInput);
  };

  if (isEditing(record)) {
    console.log("singleInput", singleInput);
    return (
      <div>
        {singleInput ? (
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor={`${dataIndex}-web`}>All:</label>
            <br></br>
            <Input
              id={`${dataIndex}-web`}
              placeholder={record[dataIndex].web}
              value={
                editedSingleForm[record.key]?.[dataIndex]?.web ||
                record[dataIndex].web
              }
              onChange={(e) => {
                const updatedValue = e.target.value;
                const updatedEditedData = {
                  ...editedSingleForm,
                  [record.key]: {
                    ...editedSingleForm[record.key],
                    [dataIndex]: {
                      ...editedSingleForm[record.key]?.[dataIndex],
                      web: updatedValue,
                      mobi: updatedValue,
                      extension: updatedValue,
                    },
                  },
                };
                console.log("Before update:", editedSingleForm);
                setEditedSingleForm(updatedEditedData);
                console.log("After update:", editedSingleForm);
              }}
              style={{ width: "86.3%" }}
            />
          </div>
        ) : (
          ["web", "mobi", "extension"].map((key) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              <label htmlFor={`${dataIndex}-${key}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              {renderEditableCell(
                record,
                [dataIndex, key],
                key.charAt(0).toUpperCase() + key.slice(1),
                "text",
                isEditing(record),
                false
              )}
            </div>
          ))
        )}

        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <Switch
            size="small"
            style={{ marginLeft: "10px" }}
            checked={singleInput}
            onChange={toggleInputMode}
            checkedChildren="Single"
            unCheckedChildren="Separate"
          />
        </div>
      </div>
    );
  } else {
    if (allEqual) {
      return <div>{web}</div>;
    } else {
      return (
        <div>
          {["web", "mobi", "extension"].map((key) => (
            <div
              key={key}
              style={{
                color:
                  key === "web" ? "red" : key === "mobi" ? "green" : "blue",
              }}
            >
              {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                record[dataIndex][key]
              }`}
            </div>
          ))}
        </div>
      );
    }
  }
};
export default RenderTranslatedCell;
