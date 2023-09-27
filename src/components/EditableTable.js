import React, { useState } from "react";
import { Form, Table, Popconfirm, Button } from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  RightCircleOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FilterDropdown from "./FilterDropdown";
import RenderTranslatedCell from "./renderUtils";
import EditableCell from "./EditableCell";
import { Excel } from "antd-table-saveas-excel";
import {Render} from "./renderUtils"

const EditableTable = ({
  data,
  isEditing,
  edit,
  save,
  cancel,
  editingKey,
  form,
  setData, // Pass the setData function as a prop
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
      width: "14%",
      render: (_, record) =>
        Render(record, language.dataIndex, isEditing, setData, data),
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
      title: "Operations",
      dataIndex: "operation",
      width: "14%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
              icon={<SaveOutlined />}
            >
              Save
            </Button>
            <Button>
              <Popconfirm
                title="Sure to cancel?"
                icon={<DeleteOutlined />}
                onConfirm={cancel}
              >
                <a>Cancel</a>
              </Popconfirm>
            </Button>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
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

  const handleExport = () => {
    const excel = new Excel();
    excel
      .addSheet("Sheet1")
      .addColumns(mergedColumns)
      .addDataSource(filteredData)
      .saveAs("i18n.xlsx");
  };

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: "0.5cm" }}
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Export to Excel
        </Button>

        <div style={{ marginLeft: "2cm" }}>
          <Button
            type="primary"
            size="small"
            icon={<RightCircleOutlined />}
            onClick={() => setShowEmptyData(!showEmptyData)}
          >
            {showEmptyData ? "Empty Data" : "Non-Empty Data"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditableTable;
