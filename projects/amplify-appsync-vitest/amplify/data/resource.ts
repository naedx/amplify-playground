import { defineData } from '@aws-amplify/backend';

import { AmplifyDataDefinition } from '@aws-amplify/data-construct';

import path from 'path';

import { glob } from 'glob';

const __dirname = path.resolve('amplify/data');

// get all schema files
const schemaFilePatterns = await glob([
  `${__dirname}/schema/schema.graphql`,
  `${__dirname}/features/**/schema.*.graphql`
]);

export const gqlSchema = AmplifyDataDefinition.fromFiles(
  ...schemaFilePatterns
);

const schema = `
  ${gqlSchema.schema}
`;

console.log('Deploying with the following schema files:', schemaFilePatterns);

export const data = defineData({
  name: 'AmplifyAppSyncVitest',
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 7
    },
  },
});