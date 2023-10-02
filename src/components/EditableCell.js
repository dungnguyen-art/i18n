import React from 'react';
import { InputNumber, Input, Form } from 'antd';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    updateAllFields,
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
            rules={[
              {
                // required: true,
                // message: `Please Input ${title}!`,
              },
            ]}
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