import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { defineCustomData } from './data/custom-resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

export type DefinedBackendResourcesType = typeof backend;

defineCustomData(Stack.of(backend.data), backend);
