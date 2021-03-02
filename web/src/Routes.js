import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Layout } from "antd";
import decode from "jwt-decode";

import PublicHeader from "./components/PublicHeader";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { Login, SignUp } from "./routes/auth";
import Landing from "./routes/landing";
import AddRecipe from "./routes/addRecipe";
import Recipe from "./routes/recipe";
import MyRecipe from "./routes/myRecipe";
import NotFound from "./routes/errorPages/notFound";
import NetworkError from "./routes/errorPages/networkError";

const { Content } = Layout;

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }

  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    }
  />
);

export default () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token"));
  return (
    <BrowserRouter>
      <Layout>
        <Layout>
          <PublicHeader loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <Content
            style={{
              minHeight: "100vh",
              paddingTop: "3rem",
              // display: "block",
              // marginLeft: "auto",
              // marginRight: "auto",
            }}
          >
            <ScrollToTop />
            <Switch>
              <PrivateRoute path="/myRecipe" exact component={MyRecipe} />
              <Route
                path="/login"
                exact
                render={(props) => (
                  <Login {...props} loggedIn setLoggedIn={setLoggedIn} />
                )}
              />
              <Route
                path="/signup"
                exact
                render={(props) => <SignUp {...props} isLogin={false} />}
              />
              <Route path="/addRecipe" exact component={AddRecipe} />
              <Route
                path="/recipe/:recipeUUID/edit"
                exact
                component={AddRecipe}
              />
              <Route path="/recipe/:recipeUUID" exact component={Recipe} />
              <Route exact path="/" component={Landing} />
              <Route exact path="/500" component={NetworkError} />
              <Route path="/" component={NotFound} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};
