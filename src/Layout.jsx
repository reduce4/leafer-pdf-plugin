import { Layout, Menu, theme } from "antd";
const { Header, Content, Sider } = Layout;
import menuItem from "./config/menus";
import menuLeftItems from "./config/leftMenus";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ILayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState([]);
  useEffect(() => {
    setSelectedKeys(["1"]);
  }, []);

  useEffect(() => {
    if (selectedKeys.length == 0) {
      return;
    }
    navigate(menuLeftItems.find((e) => e.key == selectedKeys[0]).router);
  }, [selectedKeys]);

  return (
    <Layout
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={menuItem}
        />
      </Header>
      <Content
        style={{
          padding: "0 50px",
          flex: 1,
        }}
      >
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              onClick={(e) => {
                setSelectedKeys([e.key]);
              }}
              selectedKeys={selectedKeys}
              mode="inline"
              style={{
                height: "100%",
              }}
              items={menuLeftItems}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};
export default ILayout;
