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
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    console.log('editing',editing);
    console.log('dataIndex',dataIndex);
    console.log('title',title);
    console.log('record',record);
    console.log('index',index);
    console.log('children',children);
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