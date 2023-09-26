import React from "react";
import EditableCell from "./EditableCell";
import { Input } from "antd";

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

const renderTranslatedCell = (record, dataIndex, isEditing, setData, data) => {
  const { web, mobi, extension } = record[dataIndex];
  console.log("record: ", record);
  const allEqual = web === mobi && mobi === extension;
  


  if (isEditing(record)) {
    if (!allEqual) {
      return (
        <div>
          {["web", "mobi", "extension"].map((key) => (
            <div key={key} style={{ marginBottom: "10px" }}>
              {renderEditableCell(
                record,
                [dataIndex, key],
                key.charAt(0).toUpperCase() + key.slice(1),
                "text",
                isEditing(record),
                false
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // logic code
      // update input value to 3 fields: web, mobile, extension
      return (
        <Input
        placeholder={record[dataIndex]["web"]}
        value={record[dataIndex]["web"]}
        onChange={(e) => {
          // Update all three fields: "web," "mobi," and "extension"
          const updatedValue = e.target.value;
          const updatedData = data.map((item) => {
            if (item.key === record.key) {
              return {
                ...item,
                [dataIndex]: {
                  web: updatedValue,
                  mobi: updatedValue,
                  extension: updatedValue,
                },
              };
            }
            return item;
          });
          setData(updatedData);
        }}
      />
      );
    }
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
export default renderTranslatedCell;
