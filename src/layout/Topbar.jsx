import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { capitalize } from "lodash";
import logo from "/logo1.png";
import { useGetUserProfileQuery } from "../redux/services/campaignApi";

// import { AuthContext } from "../providers/AuthProvider";
// import ChangePasswordModal from "../pages/auth/ChangePassword";

const TopBar = () => {
  // const { handleLogout } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  // const { data: loggedInUser } = useGetMeQuery();

  const items = [
    {
      key: "1",
      label: (
        <Button block type="ghost" onClick={"handleLogout"}>
          Logout
        </Button>
      ),
    },
  
  ];

  return (
    <>
      <Row justify={"center"} align={"middle"} style={{ height: "100%" }}>
        <Col span={22}>
          <Row
            align={"stretch"}
            justify={"space-between"}
            style={{ height: "100%" }}
          >
            <Link to={"/"}>
              <Image
                src={logo}
                preview={false}
                style={{ objectFit: "contain" }}
                height={40}
                width={170}
              />
            </Link>
            <Space size={"middle"} align="center" direction="horizontal">
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottom"
              >
                <Space size={"middle"} direction="horizontal">
                  <Avatar
                    style={{
                      verticalAlign: "middle",
                      backgroundColor: "#f56a00",
                    }}
                    size="default"
                  >
                    {capitalize("A")}
                  </Avatar>
                  <Space.Compact size={"small"} direction="vertical" block>
                    <Typography.Text
                      strong
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {"Admin"}
                    </Typography.Text>
                  </Space.Compact>
                </Space>
              </Dropdown>
            </Space>
          </Row>
        </Col>
      </Row>
      {/* <ChangePasswordModal openModal={openModal} setOpenModal={setOpenModal} /> */}
    </>
  );
};

export default TopBar;
