export default {
  testEnvironment: "jsdom", // Simulate browser environment
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Use Babel to transform JS/JSX files
  },
  moduleNameMapper: {
    "\\.(svg|jpg|jpeg|png|gif)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
