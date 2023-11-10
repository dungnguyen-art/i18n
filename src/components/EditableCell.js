import React from 'react';
import { InputNumber, Input, Form } from 'antd';
const EditableCell = ({
    editing,
    dataIndex,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
              width:"100%"
            }}
          >
          {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  export default EditableCell;