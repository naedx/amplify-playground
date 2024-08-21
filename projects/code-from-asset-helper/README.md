# Code from Asset Helper

A helper to build, bundle and copy a lambda or AppSync function to the Amplify assets directory. 

## Installation

`npm install --save-dev @amplify-playground/code-from-asset-helper`


## Basic Usage

### Lambda Functions

The example below defines an Amplify backend and builds and bundles the function `my-custom-function.lambda.ts` using esbuild.

```ts

import { BuildMode, lambdaCodeFromAssetHelper } from '@amplify-playground/code-from-asset-helper';
import { defineBackend } from '@aws-amplify/backend';
import {
  Function as LambdaFunction,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';
import path from 'path';

const backend = defineBackend({
  //..
});

const stack = backend.createStack('MyCustomStack');

const buildConfig: AssetHelperConfig = { 
  buildMode: BuildMode.Esbuild
};

const myLambda = new LambdaFunction(stack, 'MyCustomFunction', {
  handler: 'index.handler',
  code: lambdaCodeFromAssetHelper(
    path.resolve('amplify/functions/my-custom-function.lambda.ts'),
    buildConfig
  ),
  runtime: LambdaRuntime.NODEJS_20_X,
});


```

## Configuration

Disable building and copy file as is:

```ts 
const buildConfig: AssetHelperConfig = { 
  buildMode: BuildMode.Off
}

```

Transpile using the TypeScript transpiler:

```ts 
const buildConfig: AssetHelperConfig = { 
  buildMode: BuildMode.Typescript,
  tsTranspileOptions: {} // Optional
}

```

Build and bundle to a single file using esbuild (recommended):

```ts 
const buildConfig: AssetHelperConfig = { 
  buildMode: BuildMode.Esbuild,
  esBuildOptions: {} // Optional
}

```
### AppSync functions

The path to your `tsconfig.json` must be provided when building AppSync resolver functions. This allows linting against AppSync resolver functions' rules. 

The following example configures a pipeline resolver for a field `createTodo` :

```js
//...

const backend = defineBackend({
  data
});

const buildConfig: AppSyncAssetHelperConfigES = {
  buildMode: BuildMode.Esbuild,
  tsConfig: path.join('amplify/data', 'tsconfig.json'),
};

backend.data.addResolver('createTodo', {
    fieldName: 'createTodo',
    typeName: 'Mutation',
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(
            //this function is plain js
            path.join(__dirnameCommon, 'pipeline-handler.resolver.js') 
    ),
    pipelineConfig: [
      new AppsyncFunction(stack, 'TodoCreate', {
        api: backend.data.resources.graphqlApi,
        dataSource: todoDataSource,
        name: 'TodoCreate',
        code: await appSyncCodeFromAssetHelper(
          path.join(__dirname, 'todo-create.resolver.ts'), 
          buildConfig
        ),
        runtime: FunctionRuntime.JS_1_0_0,
      })
    ]
  });

```