# AWS Amplify + @graphql-codegen/cli

This is an example of how to setup @graphql-codegen/cli to work with an AWS Amplify project. This is useful if Amplify codegen doesn't quite provide what you need out of the box.

## Project overview

- amplify/data/** :
  - Your usual Amplify project files live here. The codegen is configured to find schema files nested within this directory (eg. schema.blog.graphql) and documents (eg. queries.blog.graphql). See graphql-codegen-config.ts for the patterns it matches and configure it as desired.

- amplify/data/schema/generated/schema.{json|ts}:
  - This is the introspection schema and TypeScript types that are generated from the consolidated schema.

- builders/graphql-codegen/graphql-codegen.config.ts 
  - This is the file that configures the how and where graphql-codegen outputs the generated files.

- lib/api/amplify/**
  - The config file directs graphql-codegen to output the consolidated schema and documents (queries, mutations, subscriptions) here.

- lib/data/models/app_models
  - The config file directs graphql-codegen to output your models here. This example targets Dart/Flutter using the Freezed package but this can be configured to target other languages/frameworks.

- package.json
  - This contains the set of packages required as well as scripts defined to allow `npm run build:graphql-codegen` and `npm run watch:graphql-codegen` for build and watch.

- .vscode/tasks.json
  - This defines a task to automatically run the watch command (above).