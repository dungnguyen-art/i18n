import React, { useState } from "react";
import {
  Form,
  Table,
  Popconfirm,
  Button,
  Pagination,
  Layout,
  Space,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  RightCircleOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import FilterDropdown from "./FilterDropdown";
import EditableCell from "./EditableCell";
import { Render } from "./renderUtils";
import { useEditedSingleForm } from "./EditedSingleFormContext";

const EditableTable = ({
  data,
  isEditing,
  edit,
  save,
  cancel,
  editingKey,
  setEditingKey,
  form,
  setData, // Pass the setData function as a prop
  getRowClassName1, // Apply the class to edited rows
}) => {
  const [showEmptyData, setShowEmptyData] = useState(true);
  const [parentData, setParentData] = useState(true);
  const { editedSingleForm, setEditedSingleForm } = useEditedSingleForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const updateParentData = (receive) => {
    setParentData(receive);
  };

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
          dataIndex={"Key"}
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
      render: (_, record) => (
        <Render
          record={record}
          dataIndex={language.dataIndex}
          isEditing={isEditing}
          setData={setData}
          data={data}
          updateParentData={updateParentData}
          setParentData={setParentData}
        />
      ),
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
          dataIndex={language.title}
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
              onClick={() => {
                if (true) {
                  save(editedSingleForm, data, setData, record.key, parentData);
                } else {
                  save(record.key);
                }
              }}
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
            return ["web", "mobi", "extension"].some((key) => {
              const value = record[dataIndex][key];
              return value.trim() === "";
            });
          }
          return false;
        });
      });

  console.log("filteredData", filteredData);

  // Calculate the start and end indices for displaying data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const displayedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page, size) => {
    // Update the current page and page size state variables
    setCurrentPage(page);
    setPageSize(size);
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
          dataSource={displayedData}
          columns={mergedColumns}
          rowClassName={getRowClassName1} // Apply the class to edited rows
          pagination={false}
          scroll={{y:800}}
        />
       
        <br></br>
        <Pagination
          showSizeChanger
          onChange={handlePageChange}
          total={filteredData.length} // Pass the total number of items in your data source
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          pageSizeOptions={[5, 10, 100, 500]}
          current={currentPage}
          pageSize={pageSize}
          style={{ float: "right" }}
        />
      </Form>
      <br></br>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
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
