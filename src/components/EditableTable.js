import React, { useState } from "react";
import {
  Form,
  Table,
  Popconfirm,
  Button,
  Pagination,
  Layout,
  Space,
  Menu,
  Breadcrumb,
  theme,
  Input,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  RightCircleOutlined,
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  HomeOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import FilterDropdown from "./FilterDropdown";
import EditableCell from "./EditableCell";
import { Render } from "./renderUtils";
import { useEditedSingleForm } from "./EditedSingleFormContext";
// import { Route, Routes, useNavigate, userNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;

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
  onSearchChange,
  onSearchSubmit
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
    { title: "Russian", dataIndex: "ru" },
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
                save(editedSingleForm, data, setData, record.key, parentData);
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
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header
          style={{
            textAlign: "center",
            backgroundColor: "purple",
            height: "50px",
            color: "white",
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ flex: '1' }}>I18N Tool - SubWallet</span>
          <div>
            <Input
              placeholder="Input your Token"
              style={{ marginLeft: 10, width: 200}}
              onChange={onSearchChange}
              onPressEnter={onSearchSubmit}
              // Add your form logic (e.g., onChange, onSubmit) here
            />
          </div>
        </Header>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Form
            form={form}
            component={false}
            style={{ backgroundColor: "#f79e94", flex: 1, overflow: "auto" }}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={displayedData}
              columns={mergedColumns}
              rowClassName={getRowClassName1}
              pagination={false}
              scroll={{ y: 600 }}
              style={{ maxHeight: "calc(100vh - 200px)", padding: "0 200px" }}
            />
          </Form>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1px",
          }}
        >
          <Pagination
            showSizeChanger
            onChange={handlePageChange}
            total={filteredData.length}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            pageSizeOptions={[5, 10, 100, 500]}
            current={currentPage}
            pageSize={pageSize}
            style={{ float: "right", padding: "0 20px" }}
          />
        </div>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "purple",
            color: "white",
            height: "50px",
          }}
        >
          SubWallet ©2023 Created by SubWallet Team
        </Footer>
      </div>
    </>
  );
};
export default EditableTable;
