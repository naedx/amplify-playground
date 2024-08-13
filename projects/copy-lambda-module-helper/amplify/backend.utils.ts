import { BundlingOptions } from 'aws-cdk-lib';
import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';
import path from 'path';


import { buildSync } from 'esbuild';
import fs from 'fs';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

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
 * @param sourceFilePath - The path of the target file (.cjs/.js/.ts) as a string.
 * @param config -  Configuration object for the asset helper.
 * @property {TranspilerOptions} transpiler - Specifies the transpiler option to use for the lambda source file.
 *  - `Off`: No transpiler is selected, meaning the source file is already JavaScript.
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
  sourceFilePath: string,
  config: AssetHelperConfig
): LambdaCode {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`The lambda source file does not exist: ${sourceFilePath}`);
  }

  return LambdaCode.fromAsset(path.dirname(sourceFilePath), {
    bundling: {
      image: LambdaRuntime.NODEJS_20_X.bundlingImage,
      command: [
        'node',
        '-e',
        `require('node:fs').copyFileSync("/asset-input/${path.basename(
          sourceFilePath
        )}", "/asset-output/index.cjs")`,
      ],
      local: {
        tryBundle(outputDir: string, options: BundlingOptions) {
          try {

            console.log('Local build mode');
            console.log('Writing to output directory: ', outputDir);

            // create output directory if it doesn't yet exist
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

            // if the source file is already js
            if (config.transpiler === TranspilerOptions.Off) {
              fs.copyFileSync(sourceFilePath, path.resolve(outputDir, 'index.js'));
            }
            // if choosing Typescript transpiler
            else if (config.transpiler === TranspilerOptions.Typescript) {
              tsTranspiling(sourceFilePath, outputDir);
            }
            // if choosing ESbuild transpiler
            else if (config.transpiler === TranspilerOptions.Esbuild) {
              esbuildBuilding(sourceFilePath, outputDir);
            }

            return true;
          } catch (error) {
            throw error; // throw an error to prevent falling back to the docker build mode
          }
        },
      },
    },
  });
}

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

const tsTranspiling = (targetModule: string, outputDir: string) => {

  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(targetModule);

  // Write the transpiled file to the output directory
  const outputFilePath = path.join(
    outputDir,
    'index.js' //path.basename(targetModule).replace('.ts', '.js')
  );

  fs.writeFileSync(outputFilePath, transpiledCode);

  return outputFilePath;
};

const esbuildBuilding = (targetModule: string, outputDir: string) => {

  // Build the source file with esbuild and write it to the output directory
  // as a CommonJS module

  let outputFilePath = path.join(
    outputDir,
    'index.cjs' //path.basename(targetModule).replace('.ts', '.cjs')
  );

  let buildResult = buildSync({
    platform: 'node',
    bundle: true,
    outfile: outputFilePath,
    entryPoints: [targetModule],
    target: 'esnext',
    format: 'cjs',
    external: [
      'aws-lambda',
      '@aws-sdk/*'
    ],
    outExtension: {
      '.js': '.cjs'
    },
  });

  console.log('build result: ', buildResult);

  return outputFilePath;
};
