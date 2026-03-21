const dotenv = require("dotenv");
const nextJestConfig = require("next/jest");

dotenv.config({
  path: ".env.development",
});
const createJestConfig = nextJestConfig({
  dir: "./",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>/"],
});

module.exports = jestConfig;
