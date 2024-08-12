import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { defineCustomData } from './data/custom-resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  // auth,
  data,
});

export type DefinedBackendResourcesType = typeof backend;

// This function manually creates the DataSources > Resolvers
defineCustomData<DefinedBackendResourcesType>(Stack.of(backend.data), backend);
