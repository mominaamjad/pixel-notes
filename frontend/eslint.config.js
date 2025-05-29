import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintPluginVitest from "eslint-plugin-vitest";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.{js,jsx}", "**/*.test.{js,jsx}"],
    plugins: {
      vitest: eslintPluginVitest,
    },
    languageOptions: {
      globals: {
        ...globals.browser,

        ...eslintPluginVitest.environments.env.globals,
      },
    },
    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
    },
  },
];
