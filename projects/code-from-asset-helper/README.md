# Code from Asset Helper

A helper to build, bundle and copy a lambda or AppSync function to the Amplify assets directory.

## Installation

`npm install --save-dev @amplify-playground/code-from-asset-helper`

## Basic Usage

### Lambda Functions

The example below defines an Amplify backend and builds and bundles the function `my-custom-function.lambda.ts` using esbuild.

```ts
import {
  BuildMode,
  lambdaCodeFromAssetHelper,
} from "@amplify-playground/code-from-asset-helper";
import { defineBackend } from "@aws-amplify/backend";
import {
  Function as LambdaFunction,
  Runtime as LambdaRuntime,
} from "aws-cdk-lib/aws-lambda";
import path from "path";

const backend = defineBackend({
  //..
});

const stack = backend.createStack("MyCustomStack");

const buildConfig: AssetHelperConfig = {
  buildMode: BuildMode.Esbuild,
};

const myLambda = new LambdaFunction(stack, "MyCustomFunction", {
  handler: "index.handler",
  code: lambdaCodeFromAssetHelper(
    path.resolve("amplify/functions/my-custom-function.lambda.ts"),
    buildConfig
  ),
  runtime: LambdaRuntime.NODEJS_20_X,
});
```

## Configuration

Disable building and copy file as is:

```ts
const buildConfig: AssetHelperConfig = {
  buildMode: BuildMode.Off,
};
```

Transpile using the TypeScript transpiler:

```ts
const buildConfig: AssetHelperConfig = {
  buildMode: BuildMode.Typescript,
  tsTranspileOptions: {}, // Optional
};
```

Build and bundle to a single file using esbuild (recommended):

```ts
const buildConfig: AssetHelperConfig = {
  buildMode: BuildMode.Esbuild,
  esBuildOptions: {}, // Optional
};
```

### AppSync functions

The following example configures a pipeline resolver for a field `createTodo` :

```js
//...

const backend = defineBackend({
  data,
});

const buildConfig: AppSyncAssetHelperConfigES = {
  buildMode: BuildMode.Esbuild,
};

backend.data.addResolver("createTodo", {
  fieldName: "createTodo",
  typeName: "Mutation",
  runtime: FunctionRuntime.JS_1_0_0,
  code: Code.fromAsset(
    //this function is plain js
    path.join(__dirnameCommon, "pipeline-handler.resolver.js")
  ),
  pipelineConfig: [
    new AppsyncFunction(stack, "TodoCreate", {
      api: backend.data.resources.graphqlApi,
      dataSource: todoDataSource,
      name: "TodoCreate",
      code: await appSyncCodeFromAssetHelper(
        path.join(__dirname, "todo-create.resolver.ts"),
        buildConfig
      ),
      runtime: FunctionRuntime.JS_1_0_0,
    }),
  ],
});
```

### Linting

ESLint is called on the target source file as well as each its nested import files. Linting rules are picked up from your eslint configuration file (eg. eslint.config.mjs) in your project. Assuming that you are working with Lambda (node) and AppSync resolvers (AppSync_JS) then you will want a set of rules that constrains your code to what is available to the respective runtime environments.

The following configures linting for a project that contains source for both environments. As such, the project uses the convention of suffixing AppSync resolvers with `*.resolver.ts` and Lambda code with `*.lambda.ts`. This allows the eslint rules to apply the contraints appropriately.

The config below also bans importing `*.resolver.ts` code in `*.lambda.ts` scripts and vice versa.

With this config in your project, you can get live linting in your IDE as well as when Amplify builds your code imported using the code from asset helper functions.

```typescript
//File: eslint.config.mjs
import eslint from "@eslint/js";
import typescriptEslintParser from "@typescript-eslint/parser";
import globals from "globals";
import tseslint from "typescript-eslint";

// The AWS AppSync plugin that provides the rules for AppSync_JS:
import appsyncPlugin from "@aws-appsync/eslint-plugin";

export default tseslint.config(
  {
    ignores: [...ignoreFiles],
  },
  {
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
      },
    },
  },
  {
    // :: Main Source Files
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],

    rules: {
      ...rulesNoUnusedVarsConfig,
    },
    files: ["**/*.ts", "eslint.config.mjs"],
    ignores: [...ignoreFiles],
  },
  {
    // :: Resolver files
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      appsyncPlugin.configs.recommended,
    ],
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
      ...rulesNoUnusedVarsConfig,
    },
    files: ["**/*.resolver.ts"],
    ignores: [...ignoreFiles, "**/*.test.ts", "**/*.lambda.ts"],
  },
  {
    // :: Lambda files
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@aws-appsync/utils", "@aws-appsync/utils/*"],
              message:
                "usage of appsync utils in a lambda function is disallowed.",
              allowTypeImports: true,
            },
            {
              group: ["*.resolver"],
              message: "usage of .resolver utilities is not allowed",
              allowTypeImports: true,
            },
          ],
        },
      ],
      ...rulesNoUnusedVarsConfig,
    },
    files: ["**/*.lambda.ts"],
    ignores: [...ignoreFiles, "**/*.test.ts", "**/*.resolver.ts"],
  },
  {
    // :: Tests
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    rules: {
      ...rulesNoUnusedVarsConfig,
    },
    files: ["**/*.{.test.ts}"],
    ignores: [...ignoreFiles],
  }
);

// Ignore Files
const ignoreFiles = [
  "**/build/**",
  "**/dist/**",
  "**/node_modules/**",
  "**/.amplify/",
  "**/codegen-out/**",
  "**/*.generated.ts",
];

// (Optional) Rule Override: allow unusued vars that are explicitly prefixed with `_unused`
const rulesNoUnusedVarsConfig = {
  "@typescript-eslint/no-unused-vars": [
    2,
    {
      argsIgnorePattern: "^_unused",
      varsIgnorePattern: "^_unused",
      caughtErrorsIgnorePattern: "^_unused",
    },
  ],
};
```

## Breaking Changes

### v1.x > v2.x:

- Upgrades eslint from v8 to v9. Eslint's FlatConfig is now required.

## License

Apache License 2.0
