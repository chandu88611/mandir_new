import { DeleteOutlined, EditTwoTone } from "@ant-design/icons";
import {
  Button,
  Flex,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";

import PrimaryWrapper from "../../components/PrimaryWrapper";
import { useGetAllUserQuery } from "../../redux/services/campaignApi";

const Users = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const { data, isLoading: loadingUsers } = useGetAllUserQuery({ page });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (record, item, index) => index + 1,
    },
    {
      title: "Phone Number",
      dataIndex: "mobile_number",
    },
    // {
    //   title: "Action",
    //   dataIndex: "id",
    //   fixed: "right",
    //   width: 100,
    //   render: (record) => (
    //     <Space>
    //       <Popconfirm
    //         title="Are you sure to delete this?"
    //         onConfirm={() => deleteRecord(record)}
    //         okText="Yes"
    //         okButtonProps={{ loading: deleting }}
    //         placement="topLeft"
    //         cancelText="No"
    //       >
    //         <Button icon={<DeleteOutlined />} danger />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  const onChange = (page) => {
    setSearchParams(
      (prev) => {
        prev.set("page", page);
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <PrimaryWrapper>
      <Row justify={"space-between"} gutter={[0, 0]} align="middle">
        <Typography.Title level={2}>Users</Typography.Title>
      </Row>
      <Table
        columns={columns}
        dataSource={data || []}
        loading={loadingUsers}
        onChange={onChange}
        pagination={false}
      />
      <Flex justify="center">
        <Pagination
          defaultCurrent={1}
          total={data?.count}
          pageSize={50}
          showSizeChanger={false}
          onChange={onChange}
          current={+page}
          hideOnSinglePage={true}
        />
      </Flex>
    </PrimaryWrapper>
  );
};
export default Users;
