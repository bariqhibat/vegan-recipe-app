module.exports = {
  setupFilesAfterEnv: ["<rootDir>tests/utils/setupTests.js"],
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  preset: "@shelf/jest-mongodb",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
