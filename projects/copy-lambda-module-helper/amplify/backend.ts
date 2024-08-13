import { defineBackend } from '@aws-amplify/backend';
import {
  Function as LambdaFunction,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';
import path from 'path';
import { BuildMode, lambdaCodeFromAssetHelper } from './backend.utils';

const backend = defineBackend({
  // auth,
  // data,
  // storage
});

const stack = backend.createStack('MyCustomStack');
// const stack = Stack.of(backend.storage.resources.bucket); // or something like this

const myLambda = new LambdaFunction(stack, 'MyCustomFunction', {
  handler: 'index.handler',
  code: lambdaCodeFromAssetHelper(
    path.resolve('amplify/functions/my-custom-function.lambda.ts'),
    { buildMode: BuildMode.Esbuild }
  ),
  runtime: LambdaRuntime.NODEJS_20_X,
});
