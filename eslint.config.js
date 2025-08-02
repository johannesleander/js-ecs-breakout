import js from "@eslint/js";
import pluginImport from "eslint-plugin-import"
import globals from "globals";
// eslint-disable-next-line import/extensions
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js, import: pluginImport }, extends: ["js/recommended"], languageOptions: { globals: { ...globals.browser, ApeECS: "readonly", Bun: "readonly" } } },
  {
    "rules": {
      "import/extensions": [
        "error",
        "always",
        {
          "js": "always",
          "mjs": "always"
        }
      ]
    },
    "settings": {
      "import/extensions": [
        ".js",
        ".mjs"
      ],
      "import/resolver": {
        "node": {
          "extensions": [
            ".js",
            ".mjs"
          ]
        }
      }
    }
  }
]);
