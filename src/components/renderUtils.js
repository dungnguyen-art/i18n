import React, { useState } from "react";
import EditableCell from "./EditableCell";
import { Input, Switch } from "antd";

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

export const Render = (record, dataIndex, isEditing, setData, data) => {
  return (
    <>
      {/* Other components */}
      <RenderTranslatedCell
        record={record}
        dataIndex={dataIndex}
        isEditing={isEditing}
        setData={setData}
        data={data}
      />
    </>
  );
};

const RenderTranslatedCell = ({
  record,
  dataIndex,
  isEditing,
  setData,
  data,
}) => {
  const { web, mobi, extension } = record[dataIndex];
  console.log("record: ", record);
  const allEqual = web === mobi && mobi === extension;

  const [useSingleInput, setUseSingleInput] = useState(false);

  const toggleInputMode = () => {
    setUseSingleInput((prevMode) => !prevMode);
  };

if (isEditing(record)) {
  return (
    <div >
      {useSingleInput ? (
        allEqual ? (
          <div style={{ marginBottom: "10px"}}>
            <label htmlFor={`${dataIndex}-web`}>Web:</label>
            <Input
              id={`${dataIndex}-web`}
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
          </div>
        ) : (
          
        ["web"].map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label htmlFor={`${dataIndex}-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
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
        )
      ) : (
        ["web", "mobi", "extension"].map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label htmlFor={`${dataIndex}-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
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
            right: "10px", // Added 'right' property
          }}
        >
          <Switch
            size="small"
            style={{ marginLeft: "10px" }}
            checked={useSingleInput}
            onChange={toggleInputMode}
            checkedChildren="Separate"
            unCheckedChildren="Single"
          />
        </div>
    </div>
  );
}
else {
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