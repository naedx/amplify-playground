# Copy Lambda Module Helper

Helper function to copy lambda code to the Amplify assets directory so that it can be packaged and uploaded. It assumes that you have a watcher that transpiles your lambda to a .cjs. If you don't, you could modify the code to include a transpilation step.

## Project overview

- amplify/backend.utils.ts :
  - Contains the helper function `fromAssetHelper(targetModule: string)`. 

- amplify/backend.ts :
  - Shows how the helper function can be used. 