import React, { useContext } from "react";
import { Row, Col, Typography } from "antd";

import RecipeCard from "../../components/RecipeCard";
import PlusCard from "../../components/PlusCard";

import LandingContainer from "./LandingContainer";
import LandingContext from "./LandingContext";

const { Title } = Typography;

const LandingContent = () => {
  const { recipes, history, skeletonLoading } = useContext(LandingContext);
  return (
    <div>
      <div
        style={{
          backgroundColor: "#34495e",
          color: "#fff",
          padding: "10rem",
        }}
      >
        <Row gutter={8} justify="space-between" style={{ height: "20rem" }}>
          <Col lg={12} md={24} xs={24}>
            <Title style={{ color: "#fff" }}>LAVA</Title>
            <Title level={2} style={{ color: "#fff" }}>
              Recipe for everyone
            </Title>
            <h1 style={{ color: "#fff" }}>
              Be a pioneer to enlighten millions of people
            </h1>
            <h1 style={{ color: "#fff" }}>
              Start on adding your recipes <strong>now</strong>!
            </h1>
          </Col>
          <Col lg={12} md={0} xs={0}>
            <img
              src="http://keyword-hero.com/wp-content/uploads/2017/04/Cart-Hero.png"
              alt="hero image"
              style={{
                height: "100%",
                position: "absolute",
                right: 0,
              }}
            />
          </Col>
        </Row>
      </div>
      <div
        style={{
          margin: "auto",
          padding: "0 1rem",
          textAlign: "center",
          paddingTop: "3rem",
        }}
      >
        <Title level={2}>Our current recipes</Title>
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
                      fromLanding
                      title={recipe.title}
                      image={recipe.image}
                      onClick={() => history.push(`/recipe/${recipe._id}`)}
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

export default ({ jestMock }) => {
  if (jestMock) jestMock("landing rendered!");
  return (
    <LandingContainer>
      <LandingContent />
    </LandingContainer>
  );
};
