import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

export default ({ jestMock }) => {
  if (jestMock) jestMock("500 rendered!");
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};
