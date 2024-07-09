import { Table } from "antd"
import { useEffect, useState } from "react";

const CustomTable = ({ columns, list, Loading }) => {
    const [data, setData] = useState()
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        total: list?.length,
    });

    useEffect(() => { setData(list) }, [list])

    const handleTableChange = (pagination, filters) => {
        setTableParams({
            pagination,
            filters,
        });
        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return <Table
        columns={columns}
        dataSource={data}
        onChange={handleTableChange}
        // loading={Loading}
        pagination={{
            ...tableParams,
            position: ["", "bottomCenter"],
        }} />

}

export default CustomTable