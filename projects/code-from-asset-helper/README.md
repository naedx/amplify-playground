# Code from Asset Helper

A helper to build, bundle and copy a lambda function to the Amplify assets directory. 

## Basic Usage 

The example below defines an Amplify backend and builds and bundles the function `my-custom-function.lambda.ts` using esbuild.

```ts

import { BuildMode, lambdaCodeFromAssetHelper } from '@amplify-playground/lambda-code-from-asset-helper';
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

const myLambda = new LambdaFunction(stack, 'MyCustomFunction', {
  handler: 'index.handler',
  code: lambdaCodeFromAssetHelper(
    path.resolve('amplify/functions/my-custom-function.lambda.ts'),
    { 
      buildMode: BuildMode.Esbuild
    }
  ),
  runtime: LambdaRuntime.NODEJS_20_X,
});


```

## Configuration

Disable building and copy file as is:

```ts 
{ 
  buildMode: BuildMode.Off
}

```

Transpile using the TypeScript transpiler:

```ts 
{ 
  buildMode: BuildMode.Typescript,
  tsTranspileOptions: {} // Optional
}

```

Build and bundle using esbuild:

```ts 
{ 
  buildMode: BuildMode.Off,
  esBuildOptions: {} // Optional
}

```
