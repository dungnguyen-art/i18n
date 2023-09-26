import React from "react";
import EditableCell from "./EditableCell";

export const renderEditableCell = (record, dataIndex, title, inputType, isEditing) => (
  <EditableCell
    editing={isEditing}
    dataIndex={dataIndex}
    title={title}
    inputType={inputType}
    record={record}
  />
);

const renderTranslatedCell = (record, dataIndex, isEditing) => {
  const { web, mobi, extension } = record[dataIndex];
  const allEqual = web === mobi && mobi === extension;

  if (isEditing(record)) {
    return (
      <div>
        {["web", "mobi", "extension"].map((key) => (
          renderEditableCell(
            record,
            [dataIndex, key],
            key.charAt(0).toUpperCase() + key.slice(1),
            "text",
            isEditing(record)
          )
        ))}
      </div>
    );
  } else {
    if (allEqual) {
      return <div>{web}</div>;
    } else {
      return (
        <div>
          {['web', 'mobi', 'extension'].map((key) => (
            <div key={key} style={{ color: key === 'web' ? 'red' : key === 'mobi' ? 'green' : 'blue' }}>
              {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${record[dataIndex][key]}`}
            </div>
          ))}
        </div>
      );
    }
  }
};

export default renderTranslatedCell;