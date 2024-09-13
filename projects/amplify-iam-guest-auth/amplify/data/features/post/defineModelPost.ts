import { AmplifyData } from "@aws-amplify/data-construct";
import { Stack } from "aws-cdk-lib";
import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";

import path from 'path';
import { DataSourceRegistry } from "../../custom-resource";

const __dirname = path.resolve('amplify/data/features/post');

export function defineModelPost(
  stack: Stack,
  data: Omit<AmplifyData, "getResourceAccessAcceptor">,
  dataSourceRegistry: DataSourceRegistry
) {

  const postDs = dataSourceRegistry.getDataSource('PostTable');

  data.addResolver('createPost', {
    fieldName: 'createPost',
    typeName: 'Mutation',
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(__dirname, 'post-create.resolver.js')),
    dataSource: postDs
  });

}