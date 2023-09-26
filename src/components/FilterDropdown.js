// components/FilterDropdown.js
import React, { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const FilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
  const [searchValue, setSearchValue] = useState(selectedKeys[0]);

  const handleSearch = (event) => {
    console.log(event.target);
    confirm();
    setSelectedKeys(searchValue ? [searchValue] : []);
  };

  const handleReset = () => {
    clearFilters();
    setSearchValue("");
    setSelectedKeys([]);
  };

  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder="Search Key"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={ e => handleSearch(e)}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        {<SearchOutlined onClick={e => handleSearch(e)}/>}
        <span onClick={ e => handleSearch(e)}>Search</span>
        
      </Button>
      <Button onClick={handleReset} size="small" style={{ width: 90 }}>
        Reset
      </Button>
    </div>
  );
};

export default FilterDropdown;
