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
    console.log('input node',inputNode);
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
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