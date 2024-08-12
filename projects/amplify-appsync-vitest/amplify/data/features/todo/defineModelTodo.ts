import { AmplifyData } from "@aws-amplify/data-construct";
import { Stack } from "aws-cdk-lib";
import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";

import path from 'path';
import { DataSourceRegistry } from "../../custom-resource";

const __dirnameCommon = path.resolve('amplify/data/common');
const __dirname = path.resolve('./amplify/data/features/todo');

export function defineModelTodo(
  stack: Stack,
  data: Omit<AmplifyData, "getResourceAccessAcceptor">,
  dataSourceRegistry: DataSourceRegistry,
) {

  const todoDS = dataSourceRegistry.getDataSource('TodoTable');

  data.addResolver('getTodo', {
    fieldName: 'getTodo',
    typeName: 'Query',
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(__dirname, 'todo.create.resolver.js')),
    dataSource: todoDS
  });

}