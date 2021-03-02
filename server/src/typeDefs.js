import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";

// merge graphql types
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./graphql/schemas")),
  { all: true }
);

export default typeDefs;
