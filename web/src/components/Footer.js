import { Layout, Row, Col } from "antd";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";

const { Footer } = Layout;
export default () => (
  <Footer
    style={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#F9642D",
      color: "white",
    }}
  >
    <div>
      <Row gutter={8}>
        <Col>
          <p>
            Created by <strong>Bariq Hibatullah Nurlis</strong>
          </p>
        </Col>
      </Row>
      <Row
        gutter={8}
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Col>
          <GithubOutlined
            style={{ fontSize: "25px" }}
            onClick={() => window.open("https://github.com/bariqhibat")}
          />
        </Col>
        <Col>
          <LinkedinOutlined
            style={{ fontSize: "25px" }}
            onClick={() =>
              window.open("https://www.linkedin.com/in/bariqhibat/")
            }
          />
        </Col>
      </Row>
    </div>
  </Footer>
);
