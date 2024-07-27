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


# Setup Walkthrough

### Add builder to the project
Copy the folder `builders/` and its contents from this package to your project.


### Install pub packages
Modify `pubspec.yaml` to include the following dependencies. (Note: You should probably upgrade the packages after):

```yml
  # ...

  dependencies:
    graphql_codegen: ^0.14.0
    graphql_flutter: ^5.2.0-beta.6
    freezed_annotation: ^2.4.1
    
  dev_dependencies:
    build_runner:
    freezed: ^2.5.2
    json_serializable: ^6.7.1

```


### Configure the graphql_codegen plugin:
Copy `build.yaml` from this project to your project root.


### Add exceptions to the Dart analyzer:
Configure the analyzer to ignore linting errors in the generated files. Modify `analysis_options.yaml` to include the following.

```yml
  analyzer:
    plugins:
      - custom_lint
    exclude: 
      - lib/api/amplify/**
      - lib/models/amplify/**
      - lib/data/models/**/*.freezed.dart
      - lib/data/models/**/*.g.dart
      - lib/data/models/**
```


### Add scripts to your `package.json`

Update `package.json` to include the following scripts:

```json
  "scripts": {
    "build:graphql-codegen": "graphql-codegen --config builders/graphql-codegen/graphql-codegen.config.ts",
    "watch:graphql-codegen": "npm run build:graphql-codegen -- --watch",
    "dart_buildrunner": "dart run build_runner watch --delete-conflicting-outputs",
  }
```


### Create VSCode Task (Optional)
Create or update `.vscode/tasks.json` to include 

```json

  {
    "tasks": [
      {
        "type": "npm",
        "script": "watch:graphql-codegen",
        "path": "./",
        "group": "build",
        "problemMatcher": [],
        "label": "watch:graphql-codegen",
        "detail": "watch:graphql-codegen",
        "runOptions": {
          "runOn": "folderOpen"
        },
        "presentation": {
          "reveal": "always",
          "panel": "new"
        }
      },
      {
        "type": "npm",
        "script": "dart_buildrunner",
        "path": "./",
        "group": "build",
        "problemMatcher": [],
        "label": "dart run build_runner watch",
        "detail": "dart run build_runner watch",
        "runOptions": {
          "runOn": "folderOpen"
        }
      }
    ]
  }

```


### Define your schema:
  - Note that at least one Query must be provided
  - The system is configured to find schema definitions matching:    

    `${__dirname}/schema/schema.graphql`,
    `${__dirname}/features/**/schema.*.graphql`

  - The system is configured to find documents at:

    `${__dirname}/features/**/queries.*.graphql`
    `${__dirname}/features/**/mutations.*.graphql`

### Run the builders

Launch the tasks using the VSCode tasks or via the CLI using the NPM scripts. END.
