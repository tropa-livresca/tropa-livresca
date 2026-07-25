export default {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },

  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  setupFiles: ["<rootDir>/tests/setup/jest.setup.js"],

  collectCoverageFrom: ["src/**/*.js", "!src/api.js"],

  coverageDirectory: "coverage",

  clearMocks: true,

  restoreMocks: false,
};
