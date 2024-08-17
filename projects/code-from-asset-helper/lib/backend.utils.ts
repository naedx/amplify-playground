import { BundlingOptions } from 'aws-cdk-lib';

import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from 'aws-cdk-lib/aws-lambda';

import { Code as AppSyncCode } from "aws-cdk-lib/aws-appsync";

import path from 'path';

import { buildSync, BuildOptions as ESBuildOptions } from 'esbuild';
import { ESLint, Linter } from 'eslint';
import fs from 'fs';
import { ModuleKind, ScriptTarget, transpileModule, TranspileOptions as TSTranspileOptions } from 'typescript';

import appSyncESlintPlugin from '@aws-appsync/eslint-plugin';

/**
 * This utility function is used to create a lambda Code object (aliased as LambdaCode) from a local file.
 *
 * @param sourceFilePath - The path of the target file (.cjs/.js/.ts) as a string.
 * 
 * @param {AssetHelperConfig} config -  Configuration object for the asset helper.
 * 
 * @param {BuildMode} config.buildMode - The build mode to use for the source file.
 *  - `Off`: no transpiling is done and the file is copied as is to the output directory.
 *  - `Typescript`: the source file will be transpiled by the TypeScript compiler.
 *  - `Esbuild`: the source file will be built and bundled by esbuild.
 * 
 * @param {BuildMode} config.esBuildOptions - The build options for esbuild. Only used if buildMode is set to Esbuild.
 * 
 * @param {BuildMode} config.tsTranspileOptions - The build options for TypeScript transpiler. Only used if buildMode is set to Typescript.
 * 
 * @returns A lambda Code object (aliased as LambdaCode)
 */
export async function lambdaCodeFromAssetHelper(
  sourceFilePath: string,
  config: AssetHelperConfig
): Promise<LambdaCode> {

  return await fromAssetHelper(sourceFilePath, config, 'lambda') as LambdaCode;
}

/**
 * This utility function is used to create an AppSync Code object (aliased as AppSyncCode) from a local file.
 *
 * @param sourceFilePath - The path of the target file (.cjs/.js/.ts) as a string.
 * 
 * @param {AssetHelperConfig} config -  Configuration object for the asset helper.
 * 
 * @param {BuildMode} config.buildMode - The build mode to use for the source file.
 *  - `Off`: no transpiling is done and the file is copied as is to the output directory.
 *  - `Typescript`: the source file will be transpiled by the TypeScript compiler.
 *  - `Esbuild`: the source file will be built and bundled by esbuild.
 * 
 * @param {BuildMode} config.esBuildOptions - The build options for esbuild. Only used if buildMode is set to Esbuild.
 * 
 * @param {BuildMode} config.tsTranspileOptions - The build options for TypeScript transpiler. Only used if buildMode is set to Typescript.
 *
 * @param {BuildMode} config.tsConfig - (Required) The tsconfig.json file to use for esLinting. This is required even if buildMode is set to Off.
 * 
 * @returns An AppSync Code object (aliased as AppSyncCode)
 */
export async function appSyncCodeFromAssetHelper(
  sourceFilePath: string,
  config: AppSyncAssetHelperConfig
): Promise<AppSyncCode> {

  return await fromAssetHelper(sourceFilePath, config, 'appsync') as AppSyncCode;
}

/**
 * This utility function is used to create a Code object from a local file.
 *
 * @param sourceFilePath - The path of the target file (.cjs/.js/.ts) as a string.
 * 
 * @param {AssetHelperConfig} config -  Configuration object for the asset helper.
 * 
 * @param {BuildMode} config.buildMode - The build mode to use for the source file.
 *  - `Off`: no transpiling is done and the file is copied as is to the output directory.
 *  - `Typescript`: the source file will be transpiled by the TypeScript compiler.
 *  - `Esbuild`: the source file will be built and bundled by esbuild.
 * 
 * @param {BuildMode} config.esBuildOptions - The build options for esbuild. Only used if buildMode is set to Esbuild.
 * 
 * @param {BuildMode} config.tsTranspileOptions - The build options for TypeScript transpiler. Only used if buildMode is set to Typescript.
 * 
 * @returns A Code object
 */
export async function fromAssetHelper(
  sourceFilePath: string,
  config: AssetHelperConfig | AppSyncAssetHelperConfig,
  codeType: 'lambda' | 'appsync'
): Promise<AppSyncCode | LambdaCode> {

  // The local build mode:
  //     1. receives the path of the target file (.cjs/.js/.ts) as a string.
  //     2. receives as `outputDir` directory that where Amplify will expects to find your lambda code.
  //        This directory is under .amplify/artifacts/cdk-out/
  //     3. creates the directory if it doesn't yet exist and copies your target file to it.
  //     4. throws an Exception to prevent falling back to the docker build mode. This can be disabled by
  //        commenting out the throw statement and returning false instead.
  //
  // The docker build mode (DISABLED. See above.): 
  //     1. copies the file from the mapped input directory to the mapped output directory. 

  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`The source file does not exist: ${sourceFilePath}`);
  }

  const code = codeType === 'lambda' ? LambdaCode : AppSyncCode;

  if (codeType === 'appsync') {
    await esLinting(sourceFilePath, (config as AppSyncAssetHelperConfig).tsConfig);
  }

  const asset = code.fromAsset(path.dirname(sourceFilePath), {

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
            if (config.buildMode === BuildMode.Off) {
              fs.copyFileSync(sourceFilePath, path.resolve(outputDir, 'index.js'));
            }
            // if choosing Typescript transpiler
            else if (config.buildMode === BuildMode.Typescript) {
              tsTranspiling(sourceFilePath, outputDir);
            }
            // if choosing ESbuild transpiler
            else if (config.buildMode === BuildMode.Esbuild) {

              if (codeType === 'lambda') {
                //lambda build
                const esBuildOptions: ESBuildOptions = {
                  platform: 'node',
                  bundle: true,
                  target: 'esnext',
                  format: 'cjs',
                  external: [
                    'aws-lambda',
                    '@aws-sdk/*'
                  ],
                  outExtension: {
                    '.js': '.cjs'
                  },
                  ...config.esBuildOptions
                };

                esbuildBuilding(sourceFilePath, outputDir, 'index.cjs', esBuildOptions);
              }
              else {
                //AppSync function build
                const esBuildOptions: ESBuildOptions = {
                  sourcemap: 'inline',
                  sourcesContent: false,
                  format: 'esm',
                  target: 'esnext',
                  platform: 'node',
                  external: [
                    '@aws-appsync/utils',
                    '@aws-sdk/client-s3',
                    '@aws-sdk/s3-request-presigner',
                  ],
                  bundle: true,
                  ...config.esBuildOptions
                };

                esbuildBuilding(
                  sourceFilePath,
                  outputDir,
                  'index.js',
                  esBuildOptions
                );
              }
            }

            return true;
          } catch (error) {
            throw error; // throw an error to prevent falling back to the docker build mode
          }
        },
      },
    },
  });

  console.log('Asset created:', asset.path);
  console.log('Asset created:', asset);

  return asset;
}

export interface AssetHelperConfig {
  buildMode: BuildMode;
  esBuildOptions?: ESBuildOptions;
  tsTranspileOptions?: TSTranspileOptions;
}

export interface AppSyncAssetHelperConfig {
  buildMode: BuildMode;
  tsConfig: string; // path to tsconfig.json to be used for linting
  esBuildOptions?: ESBuildOptions;
  tsTranspileOptions?: TSTranspileOptions;
}

export enum BuildMode {
  Off,
  Typescript,
  Esbuild,
}

const tsGetTranspiledCode = (targetModule: string, tsTranspileOptions: TSTranspileOptions) => {

  const { compilerOptions, ...otherOptions } = tsTranspileOptions;

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
      ...compilerOptions
    },
    ...otherOptions
  }).outputText;
};

const tsTranspiling = (targetModule: string, outputDir: string, tsTranspileOptions: TSTranspileOptions = {}) => {

  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(targetModule, tsTranspileOptions);

  // Write the transpiled file to the output directory
  const outputFilePath = path.join(
    outputDir,
    'index.js' //path.basename(targetModule).replace('.ts', '.js')
  );

  fs.writeFileSync(outputFilePath, transpiledCode);

  return outputFilePath;
};

export const esbuildBuilding = (targetModule: string, outputDir: string, outputFileName: string, buildOptions: ESBuildOptions = {}) => {

  // Build the source file with esbuild and write it to the output directory
  // as a CommonJS module

  let outfile = path.join(
    outputDir,
    outputFileName
  );

  let buildResult = buildSync({
    outfile,
    entryPoints: [targetModule],
    ...buildOptions
  });

  console.log('Building with esbuild:', {
    source: targetModule,
    output: outfile,
    buildErrors: buildResult.errors,
    buildWarnings: buildResult.warnings
  });

  return outfile;
};

export const esLinting = async (sourceFilePath: string, tsConfig: string) => {
  const eslint = new ESLint({
    baseConfig: appSyncESlintPlugin.configs?.recommended as Linter.Config,
    overrideConfig: {
      parserOptions: {
        project: tsConfig
      }
    },
  });

  const lintResults = (await eslint.lintFiles([sourceFilePath]))[0];

  if (lintResults.errorCount > 0) {

    const messages = [...lintResults.messages, ...lintResults.suppressedMessages].map(m => {
      if (m.ruleId !== null) {
        return m.ruleId;
      }
      else if (m.fatal) {
        return `Fatal error: ${m.message}`;
      }
      else {
        return `Error: ${m.message}`;
      }
    });

    console.error(`${lintResults.errorCount} linting error(s)::`, messages);
    throw new Error(`${lintResults.errorCount} linting error(s) found:: ${messages.join(', ')}`);
  }

  return true;
};