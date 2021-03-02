module.exports = {
  // testEnvironment: 'jest-environment-jsdom-sixteen',
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^src/(.*)": "<rootDir>/src/$1",
  },
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>src/tests/utils/setupTests.js"],
};
