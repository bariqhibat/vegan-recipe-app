import React, { useContext } from "react";
import { Col, Row, Typography } from "antd";

import RecipeCard from "../../components/RecipeCard";
import PlusCard from "../../components/PlusCard";
import MyRecipeContainer from "./MyRecipeContainer";
import MyRecipeContext from "./MyRecipeContext";

const { Title } = Typography;

const capitalizeFirstLetter = (string) => {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Content = ({ initialState }) => {
  const {
    history,
    recipes,
    deleteRecipeById,
    skeletonLoading,
    me,
  } = useContext(MyRecipeContext);
  return (
    <div>
      {initialState?.justLogin && (
        <div
          style={{
            backgroundColor: "#34495e",
            color: "#fff",
            padding: "5rem",
          }}
        >
          <Title style={{ color: "#fff" }}>
            Welcome back, {capitalizeFirstLetter(me?.firstName)}
          </Title>
          <br />
          <br />
          <br />
          <Row gutter={8} justify="space-between">
            <Col lg={12} md={24} xs={24}>
              <Title level={3} style={{ color: "#fff" }}>
                So glad you're back!
                <br />
                This place hasn't been the same without you
              </Title>
            </Col>
            <Col lg={12} md={24} xs={24}>
              <Title level={4} style={{ color: "#fff" }}>
                <i>
                  "One of the marvelous things about community is that it
                  enables us to welcome and help people in a way we couldn't as
                  individuals. When we pool our strength and share the work and
                  responsibility, we can welcome many people, even those in deep
                  distress, and perhaps help them find self-confidence and inner
                  healing."
                </i>
              </Title>
              <Title
                level={5}
                style={{ color: "#fff", position: "absolute", right: 0 }}
              >
                ― Jean Vanier, Community And Growth
              </Title>
            </Col>
          </Row>
        </div>
      )}
      <div
        style={{
          margin: "auto",
          padding: "1rem",
          textAlign: "center",
          paddingTop: "3rem",
        }}
      >
        <Title level={2}>Your recipes</Title>
        <div style={{ margin: "auto", padding: "1rem" }}>
          <Row>
            {skeletonLoading ? (
              <>
                {[
                  { id: "1" },
                  { id: "2" },
                  { id: "3" },
                  { id: "4" },
                  { id: "5" },
                  { id: "6" },
                ].map(({ id }) => (
                  <Col lg={8} md={12} sm={24} key={id}>
                    <RecipeCard isRecipe={false} />
                  </Col>
                ))}
              </>
            ) : (
              <>
                <Col lg={8} md={12} sm={24} xs={24}>
                  <PlusCard />
                </Col>
                {recipes?.map((recipe) => (
                  <Col lg={8} md={12} sm={24} xs={24} key={recipe._id}>
                    <RecipeCard
                      _id={recipe._id}
                      title={recipe.title}
                      image={recipe.image}
                      onClick={() => history.push(`/recipe/${recipe._id}`)}
                      deleteRecipeById={deleteRecipeById}
                    />
                  </Col>
                ))}
              </>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ({ jestMock, location }) => {
  if (jestMock) jestMock("myRecipe rendered!");
  return (
    <MyRecipeContainer>
      <Content initialState={location?.state} />;
    </MyRecipeContainer>
  );
};
