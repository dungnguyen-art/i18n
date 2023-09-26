import React, { useState } from "react";
import { Form, Table, Typography, Popconfirm, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import FilterDropdown from "./FilterDropdown";
import renderTranslatedCell from "./renderUtils";
import EditableCell from "./EditableCell";

const EditableTable = ({
  data,
  isEditing,
  edit,
  save,
  cancel,
  editingKey,
  form,
}) => {
  const [showEmptyData, setShowEmptyData] = useState(true);
  const languages = [
    { title: "English", dataIndex: "en" },
    { title: "Vietnamese", dataIndex: "vi" },
    { title: "Chinese", dataIndex: "zh" },
    { title: "Japanese", dataIndex: "ja" },
    { title: "Spanish", dataIndex: "es" },
  ];

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      width: "15%",
      editable: false,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.key.toLowerCase().includes(value.toLowerCase()),
    },
    ...languages.map((language) => ({
      title: language.title,
      dataIndex: language.dataIndex,
      width: "15%",
      render: (_, record) =>
        renderTranslatedCell(record, language.dataIndex, isEditing),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
        />
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const dataIndex = language.dataIndex;
        if (record[dataIndex]) {
          return ["web", "mobi", "extension"].some((key) =>
            (record[dataIndex][key] || "")
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
        return false;
      },
    })),
    {
      title: (
        <span>
          Operation{" "}
          <Button
            type="primary"
            style={{ fontSize: '12px', padding: '2px 2px' }}
            onClick={() => setShowEmptyData(!showEmptyData)}
          >
            {showEmptyData ? "Empty Data" : "Non-Empty Data"}
          </Button>
        </span>
      ),
      dataIndex: "operation",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const filteredData = showEmptyData
    ? data
    : data.filter((record) => {
        return languages.some((language) => {
          const dataIndex = language.dataIndex;
          if (record[dataIndex]) {
            return ["web", "mobi", "extension"].some(
              (key) => record[dataIndex][key].trim() === ""
            );
          }
          return false;
        });
      });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default EditableTable;
