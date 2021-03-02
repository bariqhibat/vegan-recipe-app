import { Card, Button, Popconfirm, Row, message, Skeleton } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Meta } = Card;

export default ({
  _id,
  title,
  image,
  description = "A recipe just for you",
  onClick,
  deleteRecipeById,
  fromLanding = false,
  isRecipe = true,
}) => {
  const confirm = async (e) => {
    e.stopPropagation();
    const response = await deleteRecipeById({
      variables: {
        recipeUUID: _id,
      },
    });

    if (response.data.deleteRecipeById.ok) {
      message.success("Recipe deleted!");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        minWidth: "20rem",
        maxWidth: "20rem",
        margin: "auto",
        padding: "1rem 1rem",
      }}
    >
      {isRecipe ? (
        <Card
          onClick={onClick}
          hoverable
          // style={{ width: 240 }}
          cover={
            <img
              style={{ width: "100%", height: "15rem" }}
              src={
                image ||
                "https://bakingamoment.com/wp-content/uploads/2018/07/IMG_9113-best-waffle-recipe-square.jpg"
              }
              alt="Waffle"
            />
          }
        >
          <Meta title={title?.toUpperCase()} description={description} />
          {!fromLanding && (
            <Row style={{ paddingTop: "1rem" }} justify="space-between">
              <Link to={`/recipe/${_id}/edit`}>
                <Button onClick={(e) => e.stopPropagation()}>Edit</Button>
              </Link>
              <Popconfirm
                title="Are you sure to delete this recipe?"
                onConfirm={confirm}
                onCancel={(e) => e.stopPropagation()}
                okText="Yes"
                cancelText="No"
              >
                <Button onClick={(e) => e.stopPropagation()}>Delete</Button>
              </Popconfirm>
            </Row>
          )}
        </Card>
      ) : (
        <Card
          hoverable
          onClick={onClick}
          cover={
            <Skeleton.Image
              style={{
                margin: "2rem 0",
                width: "15rem",
                height: "15rem",
                minHeight: "100%",
                minWidth: "100%",
              }}
            />
          }
        >
          <Meta description={<Skeleton />} />
        </Card>
      )}
    </div>
  );
};
