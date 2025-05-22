import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next", "node_modules"],
  },
  {
    files: ["test/**/*.ts", "test/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
]);

export default eslintConfig;
