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

console.log('gqlSchema', gqlSchema)

const schema = `
  ${gqlSchema.schema}
`;

console.log('Deploying with the following schema files:', schemaFilePatterns);

export const data = defineData({
  name: 'appSyncData',
  schema,
  authorizationModes: {
    // defaultAuthorizationMode: 'apiKey',
    // apiKeyAuthorizationMode: { expiresInDays: 30 }
    defaultAuthorizationMode: 'identityPool'
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
