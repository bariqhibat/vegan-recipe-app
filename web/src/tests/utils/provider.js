import React from "react";
import { MockedProvider, MockLink } from "@apollo/client/testing";
import { onError } from "@apollo/client/link/error";
import { InMemoryCache, ApolloLink } from "@apollo/client";
// import { typeDefs } from './typeDefs'

const cache = new InMemoryCache();

const ApolloMockedProvider = ({ children, showErrors = true, ...props }) => {
  const { mocks, ...otherProps } = props;

  const mockLink = new MockLink(mocks);

  const errorLoggingLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors && showErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError && showErrors)
      console.log(`[Network error]: ${networkError}`);
  });

  const link = ApolloLink.from([errorLoggingLink, mockLink]);

  return (
    <MockedProvider
      {...otherProps}
      link={link}
      cache={cache}
      addTypename={false}
    >
      {children}
    </MockedProvider>
  );
};

export default ApolloMockedProvider;
