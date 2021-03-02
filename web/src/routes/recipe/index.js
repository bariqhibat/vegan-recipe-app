import React, { useContext } from "react";
import { Card, Row, Col, Spin, List } from "antd";
import RecipeContainer from "./RecipeContainer";
import RecipeContext from "./RecipeContext";

const Content = () => {
  const { recipe, loading } = useContext(RecipeContext);
  const capitalizeFirstLetter = (string) => {
    if (!string) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Spin spinning={loading}>
      <Card style={{ margin: "2rem 2rem" }}>
        <Row>
          <Col md={18}>
            <div>
              <h2>{recipe?.title.toUpperCase()}</h2>
              <p>
                <i>
                  Recipe by{" "}
                  <strong>
                    {capitalizeFirstLetter(recipe?.userUUID?.firstName) ||
                      "Anonymous"}
                  </strong>
                </i>
              </p>

              <br />
              <h3>Ingredients</h3>
              <div>
                {recipe?.ingredients.map((e) => (
                  <p>
                    {e.name} - {e.amount}
                  </p>
                ))}
              </div>

              <br />
              <h3>Instructions</h3>

              <div>
                <List
                  bordered
                  dataSource={recipe?.instructions}
                  style={{ width: "50%" }}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </div>
            </div>
          </Col>
          {recipe?.image && (
            <Col md={6}>
              <div style={{ textAlign: "right" }}>
                <img
                  style={{ maxWidth: "100%" }}
                  src={
                    recipe?.image ||
                    "https://bakingamoment.com/wp-content/uploads/2018/07/IMG_9113-best-waffle-recipe-square.jpg"
                  }
                  alt="dasd"
                />
                {recipe?.userUUID ? (
                  <p>
                    Photo by{" "}
                    <strong>
                      {capitalizeFirstLetter(recipe?.userUUID?.firstName)}
                    </strong>
                  </p>
                ) : (
                  <p>
                    This recipe is submitted by <strong>NON-USER</strong>
                  </p>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Card>
    </Spin>
  );
};

export default ({ jestMock }) => {
  if (jestMock) jestMock("recipe rendered!");

  return (
    <RecipeContainer>
      <Content />
    </RecipeContainer>
  );
};
