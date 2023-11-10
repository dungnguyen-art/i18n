import React, { useState } from "react";
import EditableCell from "./EditableCell";
import { Switch } from "antd";

const renderEditableCell = (
  record,
  dataIndex,
  inputType,
  isEditing,
) => (
  <EditableCell
    editing={isEditing}
    dataIndex={dataIndex}
    inputType={inputType}
    record={record}
  />
);

export const Render = ({
  record,
  dataIndex,
  isEditing,
}) => {
  return (
    <>
      <RenderTranslatedCell
        record={record}
        dataIndex={dataIndex}
        isEditing={isEditing}
      />
    </>
  );
};

const RenderTranslatedCell = ({
  record,
  dataIndex,
  isEditing,
}) => {
  const { web, mobi, extension } = record[dataIndex];
  const allEqual = web === mobi && mobi === extension;
  const [singleInput, setSingleInput] = useState(allEqual);

  const toggleInputMode = () => {
    setSingleInput((prevMode) => !prevMode);
  };

  if (isEditing(record)) {
    return (
      <div>
        {singleInput ? (
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor={`${dataIndex}-web`}>All:</label>

            {renderEditableCell(
              record,
              [dataIndex, "web"],
              "web".charAt(0).toUpperCase() + "web".slice(1),
              "text",
              isEditing(record),
              true
            )}
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
