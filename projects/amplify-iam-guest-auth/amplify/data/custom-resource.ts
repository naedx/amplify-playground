import { AmplifyData } from '@aws-amplify/data-construct';
import { Stack } from 'aws-cdk-lib';
import { BaseDataSource, DynamoDbDataSource } from 'aws-cdk-lib/aws-appsync';
import { DefinedBackendResourcesType } from '../backend';
import { defineModelPost } from './features/post/defineModelPost';

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

  defineModelPost(stack, backend.data, dataSourceRegistry);
}