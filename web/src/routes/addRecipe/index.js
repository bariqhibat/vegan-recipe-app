import React, { useContext, useEffect, useState } from "react";
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  Button,
  Spin,
  Form,
  Input,
  message,
  Upload,
  Space,
  Row,
  Col,
  InputNumber,
  Card,
} from "antd";

import AddRecipeContainer from "./AddRecipeContainer";
import AddRecipeContext from "./AddRecipeContext";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Content = () => {
  const {
    createRecipe,
    recipeUUID,
    recipe,
    updateRecipeById,
    history,
    createRecipeLoading,
    updateRecipeByIdLoading,
    // uploadFile,
  } = useContext(AddRecipeContext);
  const [imageUrl, setImageUrl] = useState(recipe?.image);
  const [giveLoading, setGiveLoading] = useState(false);

  const [formRef] = Form.useForm();

  // ! APOLLO UPLOAD
  // const onDrop = useCallback(
  //   async ([file]) => {
  //     console.log({ file });
  //     const response = await uploadFile({ variables: { file } });

  //     console.log({ response });
  //   },
  //   [uploadFile]
  // );
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  formRef.setFieldsValue({
    ...recipe,
    instructions: recipe?.instructions.map((e) => ({ description: e })),
  });

  useEffect(() => {
    if (imageUrl !== recipe?.image) {
      setImageUrl(recipe?.image);
    }
  }, [recipe]);

  const HOST_URL =
    (process.env.NODE_ENV || "").trim() !== "production"
      ? process.env.REACT_APP_PROD_HTTP_SERVER_URL
      : process.env.REACT_APP_DEV_HTTP_SERVER_URL;

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      if (!giveLoading) {
        message.loading("Uploading file...");
        setGiveLoading(true);
      }
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      message.success("File uploaded!");
      setGiveLoading(false);
      setImageUrl(info.file.response.data);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (val) => {
    if (!recipeUUID) {
      const response = await createRecipe({
        variables: {
          title: val.title,
          image: imageUrl,
          ingredients: val.ingredients,
          instructions: val.instructions.map((e) => e.description),
        },
      });

      if (response?.data?.createRecipe?.ok) {
        history.push("/myRecipe");
        message.success("Recipe created!");
      }
    } else {
      const response = await updateRecipeById({
        variables: {
          recipeUUID,
          title: val.title,
          image: imageUrl,
          ingredients: val.ingredients.map((e) => ({
            name: e.name,
            amount: e.amount,
          })),
          instructions: val.instructions.map((e) => e.description),
        },
      });

      if (response?.data?.updateRecipeById?.ok) {
        history.push("/myRecipe");
        message.success("Recipe edited!");
      }
    }
  };
  return (
    <>
      <div
        style={{
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Spin
          indicator={loadingIcon}
          spinning={updateRecipeByIdLoading || createRecipeLoading}
        >
          <Card
            style={{
              padding: "2rem 5rem",
              maxWidth: "50rem",
              minWidth: "40rem",
              width: "100%",
            }}
          >
            <h2>{recipeUUID ? "Change" : "Create"} a recipe</h2>
            <div
              style={{
                textAlign: "center",
                alignContent: "center",
              }}
            >
              <Form onFinish={onFinish} layout="vertical" form={formRef}>
                <Form.Item name="title" label="Title">
                  <Input placeholder="Chinese eggplant with spicy szechuan sauce" />
                </Form.Item>
                <Form.Item label="Image" name="file">
                  <ImgCrop rotate>
                    <Upload
                      name="file"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={HOST_URL.concat("/uploads")}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <div>
                          <PlusOutlined />
                          <p>Upload</p>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
                <div>
                  <Form.List name="ingredients">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field) => (
                          <Space
                            key={field.key}
                            align="baseline"
                            style={{ marginBottom: "0.8rem" }}
                          >
                            <Row gutter={8}>
                              <Col style={{ width: "40%" }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "name"]}
                                  fieldKey={[field.fieldKey, "name"]}
                                  label="Ingredient name"
                                  style={{ margin: "auto" }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing ingredient name",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="Carrot"
                                    style={{
                                      width: "100%",
                                      padding: "0.25rem 0.75rem",
                                      outline: "none",
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col style={{ width: "40%" }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "amount"]}
                                  fieldKey={[field.fieldKey, "amount"]}
                                  label="Ingredient amount"
                                  style={{ margin: "auto" }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing ingredient amount",
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    min={1}
                                    style={{
                                      width: "100%",
                                      outline: "none",
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col style={{ width: "20%" }}>
                                <MinusCircleOutlined
                                  onClick={() => remove(field.name)}
                                />
                              </Col>
                            </Row>
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Click here to add ingredient
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
                <div>
                  <Form.List name="instructions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, idx) => (
                          <Row
                            key={field.key}
                            align="baseline"
                            style={{ marginBottom: "0.8rem" }}
                          >
                            <Col style={{ width: "80%" }}>
                              <Form.Item
                                {...field}
                                label={`Instruction ${idx + 1}`}
                                name={[field.name, "description"]}
                                fieldKey={[field.fieldKey, "description"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing instruction",
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  rows={4}
                                  placeholder="Instruction..."
                                  style={{
                                    width: "100%",
                                    padding: "0.25rem 0.75rem",
                                    outline: "none",
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col style={{ width: "20%" }}>
                              <MinusCircleOutlined
                                onClick={() => remove(field.name)}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Click here to add instruction
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
                <Button htmlType="submit">Submit</Button>
              </Form>
            </div>
          </Card>
        </Spin>
      </div>
    </>
  );
};
export default ({ jestMock }) => {
  if (jestMock) jestMock("addRecipe rendered!");
  return (
    <AddRecipeContainer>
      <Content />
    </AddRecipeContainer>
  );
};
