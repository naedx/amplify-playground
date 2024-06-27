/**
 * This is the config file for the NPM @graphql-codegen/cli used to configure the generation of 
 * the introspection schema, models and documents from *.graphql files in amplify/data/**.
 * 
 * Note that this setup includes generation of models for Dart/Flutter using the flutter-freezed 
 * plugin. This can be removed or replaced to target another platform of your choice.
 * 
 * Install: {@link https://www.npmjs.com/package/@graphql-codegen/cli }
 * Doc: {@link https://the-guild.dev/graphql/codegen/docs/getting-started }
 * 
 * Flutter plugin doc: {@link https://the-guild.dev/graphql/codegen/docs/guides/flutter-freezed }
 */

import type { CodegenConfig } from '@graphql-codegen/cli';

import { globSync } from 'glob';

const __amplifyDataDir = 'amplify/data';

// get all schema files
const schemaFiles = globSync([
  `${__amplifyDataDir}/schema/schema*.graphql`,
  `${__amplifyDataDir}/features/**/schema*.graphql`
]);

// get all document files
const documentFiles = globSync([
  ...['documents', 'mutations', 'queries', 'subscriptions'].map(type => `${__amplifyDataDir}/schema/${type}*.graphql`),
  ...['documents', 'mutations', 'queries', 'subscriptions'].map(type => `${__amplifyDataDir}/features/**/${type}*.graphql`),
]);

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    ...schemaFiles,
    "scalar AWSDateTime",
    "scalar AWSTimestamp",
    "scalar AWSJSON"
  ],
  documents:
    documentFiles
  ,
  generates: {
    "./amplify/data/schema/generated/schema.ts": {
      plugins: ["typescript", "typescript-document-nodes"]
    },
    "./amplify/data/schema/generated/schema.json": {
      plugins: ["introspection"]
    },
    'lib/data/models/app_models.dart': {
      plugins: [{
        'flutter-freezed': {
          camelCasedEnums: true, // or false
          // OR: specify a DartIdentifierCasing
          // camelCasedEnums: 'snake_case',
          customScalars: {
            ID: 'String',
            AWSDateTime: 'DateTime',
            AWSTimestamp: 'int',
            AWSJSON: 'Map<String, dynamic>'
          }
        },
      }],
    },
    'lib/api/amplify/schema.graphql': {
      watchPattern: [
        `${__amplifyDataDir}/schema/schema*.graphql`,
        `${__amplifyDataDir}/features/**/schema*.graphql`
      ],
      plugins: [
        'builders/graphql-codegen/local-plugins/generate-frontend-graphql.plugin.js'
      ]
    },
    'lib/api/amplify/documents.graphql': {
      watchPattern: [
        `${__amplifyDataDir}/schema/schema*.graphql`,
        `${__amplifyDataDir}/features/**/schema*.graphql`,
        ...['documents', 'mutations', 'queries', 'subscriptions'].map(type => `${__amplifyDataDir}/schema/${type}*.graphql`),
        ...['documents', 'mutations', 'queries', 'subscriptions'].map(type => `${__amplifyDataDir}/features/**/${type}*.graphql`),
      ],
      plugins: [
        {
          'builders/graphql-codegen/local-plugins/generate-frontend-graphql.plugin.js': {
            outputDocumentsOnly: true
          }
        }
      ]
    }
  }
};

export default config;