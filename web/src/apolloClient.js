import {
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
// import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

console.log(process.env.NODE_ENV);
const httpBaseRoute =
  (process.env.NODE_ENV || "").trim() !== "production"
    ? process.env.REACT_APP_PROD_HTTP_SERVER_URL
    : process.env.REACT_APP_DEV_HTTP_SERVER_URL;

const httpLink = createHttpLink({
  uri: httpBaseRoute.concat("/graphql"),
});

// const uploadLink = createUploadLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-token": token,
      "x-refresh-token": refreshToken,
    },
  };
});

const afterLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();

    if (headers) {
      const token = headers.get("x-token");
      const refreshToken = headers.get("x-refresh-token");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
    return response;
  })
);

const client = new ApolloClient({
  link: authLink.concat(httpLink).concat(afterLink),
  cache: new InMemoryCache(),
});

export default client;
