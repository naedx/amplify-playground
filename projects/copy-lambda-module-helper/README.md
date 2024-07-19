# Copy Lambda Module Helper

Helper function to copy lambda code to the Amplify assets directory so that it can be packaged and uploaded. It assumes that you have a watcher that transpiles your lambda to a .cjs. If you don't, you could modify the code to include a transpilation step.

**UPDATE**:
A transpilation step is added to the helper function.

A config object is added to the helper function, in which a 'transpiler' property is used to indicate if the source file has already been transpiled or not.

Specifically, if 'transpiler' is set to 'TranspilerOptions.Off', then no transpilation is needed. But if 'transpiler' is set to 'TranspilerOptions.Typescript' or 'TranspilerOptions.Esbuild', then the corresponding transpiler will be invoked, and a temporary folder called "tmp" at the root of your project, which will store all the transpiled
files.
(**Please note**: be sure to add this temporary folder to your .gitignore)

## Project overview

- amplify/backend.utils.ts :

  - Contains the helper function `fromAssetHelper(targetModule: string)`.

- amplify/backend.ts :
  - Shows how the helper function can be used.
