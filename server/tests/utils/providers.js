import { apolloServer } from "../../src/apolloServer";
import { createTestClient } from "apollo-server-integration-testing";
// import { createTestClient } from 'apollo-server-testing'

const testClient = createTestClient({ apolloServer });

export const { mutate, query, setOptions } = testClient;

export default testClient;
