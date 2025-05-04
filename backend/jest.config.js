// jest.config.js
module.exports = {
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
      "routes/**/*.js",
      "controllers/**/*.js",
      "middleware/**/*.js",
      "!**/node_modules/**",
      "!**/tests/**"  // avoid collecting coverage on test files themselves
    ],
    coverageDirectory: "tests/coverage", // ✅ Save coverage report inside /tests
    coverageReporters: ["json", "lcov", "text", "clover"]
  };
  