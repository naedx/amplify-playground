import { AmplifyData } from '@aws-amplify/data-construct';
import { Stack } from 'aws-cdk-lib';
import { BaseDataSource, DynamoDbDataSource } from 'aws-cdk-lib/aws-appsync';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { DefinedBackendResourcesType } from '../backend';
import { defineModelTodo } from './features/todo/defineModelTodo';

export class DataSourceRegistry {
  private _data: Omit<AmplifyData, "getResourceAccessAcceptor">;

  constructor(data: Omit<AmplifyData, "getResourceAccessAcceptor">) {
    this._data = data;
  }

  getDataSource(name: string): BaseDataSource {

    const dataSource = this._data.resources.cfnResources.cfnDataSources[name]?.node?.scope as DynamoDbDataSource;

    if (!dataSource) {
      throw new Error(`Data source ${name} not found`);
    }

    return dataSource;
  }

}

export function defineCustomData<T>(stack: Stack, backend: DefinedBackendResourcesType): void {

  const dataSourceRegistry = new DataSourceRegistry(backend.data);

  defineModelTodo(stack, backend.data, dataSourceRegistry);
}

export interface BackendFunctions {
  createAttachmentPrePutLambdaResolver: IFunction;
}

