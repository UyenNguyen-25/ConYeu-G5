import { useState } from "react";
import { Select } from "antd";

const SearchInput = (props) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();
  const handleSearch = (newValue) => {
    fetch(newValue, setData);
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <Select
      {...props}
      showSearch
      value={value}
      placeholder={props.placeholder}
      className={
        "h-12 w-[300px] lg:w-full border-2 border-[#007AFB] rounded-lg text-xl"
      }
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  );
};

export default SearchInput;
