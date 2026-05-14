import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-undef": "error", // ⛔️ Catch undefined variables/components
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react/react-in-jsx-scope": "off", // For React 17+
      "react/jsx-uses-react": "off", // For React 17+
      "react/jsx-uses-vars": "error", // ⛔️ JSX tag references should be treated as variables
      "react/prop-types": "off",
      "react/display-name": "off",
    },
  },
];
