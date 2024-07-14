import { BundlingOptions } from 'aws-cdk-lib';
import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';
import path from 'path';

import { execSync } from 'child_process';

import fs from 'fs';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

/**
 * This utility function is used to create a lambda Code object (aliased as LambdaCode) from a local file.
 * It assumes that you have a watcher that transpiles your lambda to a .cjs. If you don't, you could
 * modify the code to include a transpilation step.
 *
 * UPDATE:
 * A transpilation step is added to the helper function. Specifically, the helper function will create
 * a temporary folder called "tmp" at the root of your project, which will store all the transpiled
 * files. And accordingly, be sure to add this temporary folder to your .gitignore
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
    throw new Error(`The lambda source file does not exist: ${targetModule}`);
  }

  const rootPath = path.resolve(targetModule.split(/amplify\//)[0]);
  // tmp folder path
  const tmpPath = path.join(rootPath, 'tmp');
  // Check if the tmp folder already exists
  if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

  // Transpile the source ts code into js code
  const tsSourceCode = fs.readFileSync(targetModule, 'utf8');
  const transpiledCode = transpileModule(tsSourceCode, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2020,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
    },
  }).outputText;

  // Create a temporary file for the transpiled code
  const tempFilePath = path.join(
    tmpPath,
    path.basename(targetModule).replace('.ts', '.js')
  );
  fs.writeFileSync(tempFilePath, transpiledCode);

  return LambdaCode.fromAsset(path.dirname(targetModule), {
    bundling: {
      image: LambdaRuntime.NODEJS_20_X.bundlingImage,
      command: [
        'node',
        '-e',
        `require('node:fs').copyFileSync("/asset-input/${path.basename(
          targetModule
        )}", "/asset-output/index.cjs")`,
      ],
      local: {
        tryBundle(outputDir: string, options: BundlingOptions) {
          try {
            // create directory if it doesn't exist then copy the file
            const commandString = [
              'node',
              '-e',
              `"`,
              `if (! (require('node:fs').existsSync('${path.resolve(
                outputDir
              )}'))) { require('node:fs').mkdirSync('${path.resolve(
                outputDir
              )}'); }`,
              `require('node:fs').copyFileSync('${tempFilePath}', '${path.resolve(
                outputDir
              )}/index.cjs');`,
              `"`,
            ].join(' ');

            execSync(commandString, { encoding: 'utf-8' });

            return true;
          } catch (error) {
            throw error;
            //return false;  // return false instead to fallback to bundling with docker.
          }
        },
      },
    },
  });
}
