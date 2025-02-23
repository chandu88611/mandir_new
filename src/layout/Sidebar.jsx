import { ConfigProvider, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

const menuItems = [
  {
    label: "Home",
    key: "/",
    icon: <HomeOutlined />,
  },

  {
    label: "Campaigns",
    key: "/campaigns",
    icon: <TeamOutlined />,
  },
  {
    label: "Users",
    key: "/users",
    icon: <UserOutlined />,
  },
  {
    label: "Enquiries",
    key: "/enquiries",
    icon: <UserOutlined />,
  },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (e) => {
    e.key !== null && navigate(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          iconSize: 30,
        },
        components: {
          Menu: {
            colorIcon: "green",
            size: "30px",
            fontSizeIcon: "50px",
            colorInfoActive: "red",
          },
        },
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={onClick}
        items={menuItems}
        style={{
          paddingBottom: "150px",
        }}
      />
    </ConfigProvider>
  );
};
export default SideBar;
