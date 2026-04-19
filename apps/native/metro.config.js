const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// 1. Get default config scoped to the native app so asset paths resolve correctly
const config = getDefaultConfig(projectRoot);

// 2. Adjust nodeModulesPaths for standalone stability during SDK upgrade
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Force deduplication of context-heavy packages to prevent "Multiple instances" errors
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "@react-navigation/native": path.resolve(projectRoot, "node_modules/@react-navigation/native"),
  "@clerk/clerk-expo": path.resolve(projectRoot, "node_modules/@clerk/clerk-expo"),
};

// 4. Properly resolve standard monorepo modules
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

// 5. Wrap with NativeWind configuration
module.exports = withNativeWind(config, {
  input: "./global.css",
  projectRoot,
});
