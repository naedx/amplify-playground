import eslint from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import globals from "globals";
import tseslint from "typescript-eslint";

import appsyncPlugin from "@aws-appsync/eslint-plugin";

export default tseslint.config(
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
        // tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // :: Resolver files
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked, // @TODO: upgrade to strictTypeChecked
      appsyncPlugin.configs.recommended,
    ],
    languageOptions: {
      parser: typescriptEslintParser,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs", "./eslint.config.mjs"],
        },
        // tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["aws-cdk-lib", "aws-cdk-lib/*"],
              message: "usage of appsync lambda libraries is disallowed.",
              allowTypeImports: true,
            },
            {
              group: ["*.lambda"],
              message: "usage of .lambda utilities is not allowed",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
    files: ["**/*.resolver.ts"],
    ignores: ["**/*.test.ts", "**/*.generated.ts", "**/*.lambda.ts"],
  }
);
