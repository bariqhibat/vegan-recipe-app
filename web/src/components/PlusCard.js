import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default () => {
  return (
    <div
      style={{
        textAlign: "center",
        height: "20rem",
        width: "20rem",
        margin: "auto",
        padding: "1rem 0",
        position: "relative",
      }}
    >
      <Link to="/addRecipe">
        <Card
          hoverable
          style={{
            margin: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem 2rem",
          }}
        >
          <PlusOutlined />
        </Card>
      </Link>
    </div>
  );
};
