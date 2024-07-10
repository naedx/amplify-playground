import { BundlingOptions } from 'aws-cdk-lib';
import { Code as LambdaCode, Runtime as LambdaRuntime } from "aws-cdk-lib/aws-lambda";
import path from 'path';

import { execSync } from 'child_process';

import fs from 'fs';

/**
 * This utility function is used to create a lambda Code object (aliased as LambdaCode) from a local file.
 * It assumes that you have a watcher that transpiles your lambda to a .cjs. If you don't, you could 
 * modify the code to include a transpilation step.
 * 
 * The local build mode:
 *     1. receives the path of the target file (.cjs) as a string.
 *     2. receives as `outputDir` directory that where Amplify will expects to find your lambda code.
 *        This directory is under .amplify/artifacts/cdk-out/
 *     3. creates the directory if it doesn't yet exist and copies your target file to it.
 *     4. throws an Exception to prevent falling back to the docker build mode. This can be disabled by
 *        commenting out the throw statement and return false instead.
 * 
 * The docker build mode:
 *     1. copies the file from the mapped input directory to the mapped output directory.
 *
 * @param targetModule - The path of the target file (.cjs) as a string.
 * @returns A lambda Code object (aliased as LambdaCode)
 */
export function fromAssetHelper(targetModule: string): LambdaCode {

  if (!fs.existsSync(targetModule)) {
    throw new Error(`The lambda source file does not exist: ${targetModule}`)
  }

  return LambdaCode.fromAsset(path.dirname(targetModule), {
    bundling: {
      image: LambdaRuntime.NODEJS_20_X.bundlingImage,
      command: [
        'node', "-e",
        `require('node:fs').copyFileSync("/asset-input/${path.basename(targetModule)}", "/asset-output/index.cjs")`
      ],
      local: {
        tryBundle(outputDir: string, options: BundlingOptions) {

          try {

            // create directory if it doesn't exist then copy the file
            const commandString = ['node', '-e',
              `"`,
              `if (! (require('node:fs').existsSync('${path.resolve(outputDir)}'))) { require('node:fs').mkdirSync('${path.resolve(outputDir)}'); }`,
              `require('node:fs').copyFileSync('${path.resolve(targetModule)}', '${path.resolve(outputDir)}/index.cjs');`,
              `"`
            ].join(' ');

            execSync(commandString, { encoding: 'utf-8' })

            return true

          } catch (error) {

            throw error;
            //return false;  // return false instead to fallback to bundling with docker.
          }


        },
      },
    }
  })
}
