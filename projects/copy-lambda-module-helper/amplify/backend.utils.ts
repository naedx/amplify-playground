import { BundlingOptions } from 'aws-cdk-lib';
import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';
import path from 'path';

import { execSync } from 'child_process';

import fs from 'fs';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';
import { buildSync } from 'esbuild';

/**
 * This utility function is used to create a lambda Code object (aliased as LambdaCode) from a local file.
 * It assumes that you have a watcher that transpiles your lambda to a .cjs. If you don't, you could
 * modify the code to include a transpilation step.
 *
 * UPDATE:
 * A transpilation step is added to the helper function.
 * A config object is added to the helper function, in which a 'transpiler' property is used to indicate
 * if the source file has already been transpiled or not. Specifically, if 'transpiler' is set to
 * 'TranspilerOptions.Off', then the source file is transpiled. But if 'transpiler' is set to 'TranspilerOptions.Typescript'
 * or 'TranspilerOptions.Esbuild', then the corresponding transpiler will be invoked, and
 * a temporary folder called "tmp" at the root of your project, which will store all the transpiled
 * files. And lastly, be sure to add this temporary folder to your .gitignore
 *
 * The local build mode:
 *     1. receives the path of the target file (.cjs/.js/.ts) as a string.
 *     2. receives as `outputDir` directory that where Amplify will expects to find your lambda code.
 *        This directory is under .amplify/artifacts/cdk-out/
 *     3. creates the directory if it doesn't yet exist and copies your target file to it.
 *     4. throws an Exception to prevent falling back to the docker build mode. This can be disabled by
 *        commenting out the throw statement and return false instead.
 *
 * The docker build mode:
 *     1. copies the file from the mapped input directory to the mapped output directory.
 *
 * @param targetModule - The path of the target file (.cjs/.js/.ts) as a string.
 * @param config -  Configuration object for the asset helper.
 * @property {TranspilerOptions} transpiler - Specifies the transpiler option to use for the lambda source file.
 *  - `Off`: No transpiler is selected, meaning the source file has already been transpiled.
 *  - `Typescript`: the source file will be transpiled by TypeScript compiler.
 *  - `Esbuild`: the source file will be built by esbuild.
 * @returns A lambda Code object (aliased as LambdaCode)
 */

interface AssetHelperConfig {
  transpiler: TranspilerOptions;
}

export enum TranspilerOptions {
  Off,
  Typescript,
  Esbuild,
}

export function fromAssetHelper(
  targetModule: string,
  config: AssetHelperConfig
): LambdaCode {
  if (!fs.existsSync(targetModule)) {
    throw new Error(`The lambda source file does not exist: ${targetModule}`);
  }
  let sourceFilePath: string;

  // if the source file is already transpiled
  if (config.transpiler === TranspilerOptions.Off) {
    sourceFilePath = targetModule;
  }
  // if choosing Typescript transpiler
  else if (config.transpiler === TranspilerOptions.Typescript) {
    sourceFilePath = tsTranspiling(targetModule);
  }
  // if choosing ESbuild transpiler
  else if (config.transpiler === TranspilerOptions.Esbuild) {
    sourceFilePath = esbuildBuilding(targetModule);
  }

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
              `require('node:fs').copyFileSync('${sourceFilePath}', '${path.resolve(
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

const createTmpDir = (targetModule: string) => {
  const rootPath = path.resolve(targetModule.split(/amplify\//)[0]);
  // tmp folder path
  const tmpPath = path.join(rootPath, 'tmp');
  // Check if the tmp folder already exists
  if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);
  return tmpPath;
};

const tsGetTranspiledCode = (targetModule: string) => {
  // Transpile the source ts code into js code
  const tsSourceCode = fs.readFileSync(targetModule, 'utf8');
  return transpileModule(tsSourceCode, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2020,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
    },
  }).outputText;
};

const tsCreateTranspiledFile = (
  targetModule: string,
  tmpPath: string,
  transpiledCode: string
) => {
  // Create a temporary file for the transpiled code
  const tempFilePath = path.join(
    tmpPath,
    path.basename(targetModule).replace('.ts', '.js')
  );
  fs.writeFileSync(tempFilePath, transpiledCode);
  return tempFilePath;
};

const tsTranspiling = (targetModule: string) => {
  // tmp folder path
  let tmpPath = createTmpDir(targetModule);

  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(targetModule);

  // Create a temporary file for the transpiled code
  const tempFilePath = tsCreateTranspiledFile(
    targetModule,
    tmpPath,
    transpiledCode
  );

  return tempFilePath;
};

const esbuildBuilding = (targetModule: string) => {
  // tmp folder path
  let tmpPath = createTmpDir(targetModule);
  // compose the temporary file path and build this file
  let tempFilePath = path.join(
    tmpPath,
    path.basename(targetModule).replace('.ts', '.cjs')
  );
  let buildResult = buildSync({
    platform: 'node',
    bundle: true,
    outfile: tempFilePath,
    entryPoints: [targetModule],
  });
  console.log('build result: ', buildResult);
  return tempFilePath;
};
