import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";
import path from "path";

// merge graphql resolvers
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./graphql/resolvers"), { all: true })
);

export default resolvers;
