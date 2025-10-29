const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/config/jest.setup.ts", // matches your src/tests/config folder
  ],
  testMatch: [
    "**/src/tests/**/*.test.ts"
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  verbose: true,
};
