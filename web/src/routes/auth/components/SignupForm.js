import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Row, message } from "antd";
import AuthContext from "../AuthContext";

export default () => {
  const { createUser, history } = useContext(AuthContext);

  const onFinish = async (val) => {
    try {
      const response = await createUser({
        variables: {
          email: val.email,
          password: val.password,
          firstName: val.firstName,
          lastName: val.lastName,
        },
      });

      if (response?.data?.createUser?.ok) {
        message.success("Successfully registered!");
        history.push("/login");
        return;
      }

      response?.data?.createUser?.errors.map((e) => message.error(e.message));
    } catch (err) {
      console.log({ err });
      message.error("Signup failed!");
    }
  };
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div>
        <h1>SIGN UP</h1>
        <div
        // style={{
        //   textAlign: "center",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
        >
          <Row type="flex" justify="center" align="middle" style={{}}>
            <Form
              onFinish={onFinish}
              layout="vertical"
              style={{ padding: "1rem 0", width: "100%" }}
              justify="center"
            >
              <Form.Item name="firstName" label="First name">
                <Input
                  style={{
                    width: "100%",
                    padding: "0.25rem 0.75rem",
                    outline: "none",
                  }}
                  placeholder="John"
                />
              </Form.Item>
              <Form.Item name="lastName" label="Last name">
                <Input
                  style={{
                    width: "100%",
                    padding: "0.25rem 0.75rem",
                    outline: "none",
                  }}
                  placeholder="Doe"
                />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input
                  style={{
                    width: "100%",
                    padding: "0.25rem 0.75rem",
                    outline: "none",
                  }}
                  placeholder="john@john.com"
                />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input.Password
                  style={{
                    width: "100%",
                    padding: "0.25rem 0.75rem",
                    outline: "none",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit">Submit</Button>
              </Form.Item>
            </Form>
          </Row>
        </div>
        <Link to="/login" style={{ color: "#F9642D" }}>
          <strong>Login instead</strong>
        </Link>
      </div>
    </div>
  );
};
