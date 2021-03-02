import { Layout, Space, Row } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";

const { Header } = Layout;

export default withRouter(({ history, loggedIn, setLoggedIn }) => {
  return (
    <Header
      style={{
        background: "#F9642D",
        position: "fixed",
        zIndex: "10",
        height: "3rem",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        padding: "0 30px",
      }}
    >
      <div className="--max-height --flex">
        {/* eslint-disable-next-line */}
        <h3
          onClick={() => history.push("/")}
          style={{
            color: "white",
            cursor: "pointer",
          }}
        >
          LAVA
        </h3>
      </div>
      <Space className="--max-height">
        <br />
      </Space>

      <Row justify="end">
        {loggedIn && (
          <>
            {/* eslint-disable-next-line */}
            <div
              onClick={() => {
                history.push("/myRecipe");
              }}
            >
              <h3
                style={{
                  color: "white",
                  cursor: "pointer",
                }}
              >
                My profile
              </h3>
            </div>
          </>
        )}
        <div style={{ padding: "0 1rem" }} />
        {/* eslint-disable-next-line */}
        <div
          onClick={() => {
            if (loggedIn) {
              setLoggedIn(false);
              localStorage.setItem("token", "");
              localStorage.setItem("refreshToken", "");
            }
            history.push("/login");
          }}
        >
          <h3
            style={{
              color: "white",
              cursor: "pointer",
            }}
          >
            {loggedIn ? "Logout" : "Login"}
          </h3>
        </div>
      </Row>
    </Header>
  );
});
