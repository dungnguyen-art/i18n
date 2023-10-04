import React, { useState } from "react";
import { Form, Table, Popconfirm, Button, Pagination } from "antd";

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
import { Render } from "./renderUtils";
import { useEditedSingleForm } from "./EditedSingleFormContext";
import useFetch from "./useFetch";

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

  const flattenedData = filteredData.map((item) => {
    return {
      key: item.key,
      en: item.en.web,
      vi: item.vi.web,
      zh: item.zh.web,
      ja: item.ja.web,
      es: item.es.web,
      operation: item.operation,
    };
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

  // const handleExport = () => {
  //   console.log("Merged Columns:", mergedColumns);
  //   console.log("flattenedData:", flattenedData);
  //   const excel = new Excel();
  //   excel
  //     .addSheet("Sheet1")
  //     .addColumns(mergedColumns)
  //     .addDataSource(flattenedData)
  //     .saveAs("i18n.xlsx");
  // };
  // console.log("parent:", parentData);

  // console.log("displayedData", displayedData);
  const {loading, error, dataStrapi} = useFetch('http://localhost:1338/api/i18ns/')
  if(loading) return <p>Loading...</p>
  if(error) return <p>Error ....</p>
  console.log('dataStrapi', dataStrapi);

  // const dataStrapi = {
  //   // Your dataStrapi object here...
  // };
  
  // Initialize an empty array to store the transformed data
  const displayData = [];
  
  // Loop through the 'data' array in dataStrapi
  dataStrapi.data.forEach((item) => {
    const displayItem = {
      key: item.attributes.key,
      en: {
        web: item.attributes.en.web,
        mobi: item.attributes.en.mobi,
        extension: item.attributes.en.extension,
      },
      vi: {
        web: item.attributes.vi.web,
        mobi: item.attributes.vi.mobi,
        extension: item.attributes.vi.extension,
      },
      zh: {
        web: item.attributes.zh.web,
        mobi: item.attributes.zh.mobi,
        extension: item.attributes.zh.extension,
      },
      ja: {
        web: item.attributes.ja.web,
        mobi: item.attributes.ja.mobi,
        extension: item.attributes.ja.extension,
      },
      es: {
        web: item.attributes.es.web,
        mobi: item.attributes.es.mobi,
        extension: item.attributes.es.extension,
      },
    };
  
    // Push the transformed item into the displayData array
    displayData.push(displayItem);
  });
  
  // displayData now contains the transformed data in the desired format
  console.log("displayData",displayData);
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
          dataSource={displayData}
          columns={mergedColumns}
          rowClassName={getRowClassName1} // Apply the class to edited rows
          pagination={false}
          // pagination={{
          //   pageSize: 5,
          //   showSizeChanger: false,
          //   pageSizeOptions: ["5", "10", "20"],
          //   onChange: cancel,
          // }}
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
        {/* <Button
          type="primary"
          size="small"
          style={{ marginLeft: "0.5cm" }}
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          Export to Excel
        </Button> */}

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
