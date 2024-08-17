import { BundlingOptions, BundlingOutput } from 'aws-cdk-lib';

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
  config: AppSyncAssetHelperConfigNoBuild | AppSyncAssetHelperConfigTS | AppSyncAssetHelperConfigES
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
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase,
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
    //perform linting if the code is for AppSync
    await esLinting(sourceFilePath, (config as AppSyncAssetHelperConfigBase).tsConfig);
  }

  const asset = code.fromAsset(path.dirname(sourceFilePath), {
    bundling: {
      image: LambdaRuntime.NODEJS_20_X.bundlingImage,
      command: [
        'node',
        '-e',
        `require('node:fs').copyFileSync("/asset-input/${path.basename(
          sourceFilePath
        )}", 
        "/asset-output/index.cjs")`,
      ],
      outputType: codeType === 'appsync' ? BundlingOutput.SINGLE_FILE : undefined,
      local: {
        tryBundle(outputDir: string, options: BundlingOptions) {
          try {

            // create output directory if it doesn't yet exist
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

            switch (config.buildMode) {
              case BuildMode.Off:
                // if the source file is already js
                fs.copyFileSync(sourceFilePath, path.join(outputDir, 'index.js'));
                break;
              case BuildMode.Typescript:
                // if choosing Typescript transpiler
                tsTranspiling(sourceFilePath, path.join(outputDir, 'index.js'));
                break;
              case BuildMode.Esbuild:
                // if choosing ESbuild transpiler
                const esConfig = config as AppSyncAssetHelperConfigES;

                //lambda build
                const commonOptions: ESBuildOptions = {
                  platform: 'node',
                  bundle: true,
                  target: 'esnext',
                };

                switch (codeType) {
                  case 'lambda':
                    esbuildBuilding({
                      sourceFilePath: sourceFilePath,
                      outputFilePath: path.join(outputDir, 'index.cjs'),
                      buildOptions: {
                        ...commonOptions,
                        format: 'cjs',
                        external: [
                          'aws-lambda',
                          '@aws-sdk/*'
                        ],
                        outExtension: {
                          '.js': '.cjs'
                        },
                        ...esConfig.esBuildOptions // apply user defined overrides
                      }
                    });
                    break;

                  case 'appsync':
                    esbuildBuilding({
                      sourceFilePath: sourceFilePath,
                      outputFilePath: path.join(outputDir, 'index.js'),
                      buildOptions: {
                        ...commonOptions,
                        format: 'esm',
                        external: [
                          '@aws-appsync/utils',
                          '@aws-sdk/client-s3',
                          '@aws-sdk/s3-request-presigner',
                        ],
                        ...esConfig.esBuildOptions // apply user defined overrides
                      }
                    });
                    break;

                  default:
                    throw new Error(`Invalid code type: ${codeType}`);
                }

                break;
              default:
                throw new Error(`Invalid build mode: ${config.buildMode}`);
            }

            return true;
          } catch (error) {
            throw error; // throw an error to prevent falling back to the docker build mode
          }
        },
      },
    },
  });

  return asset;
}

export interface AssetHelperConfig {
  buildMode: BuildMode;
  esBuildOptions?: ESBuildOptions;
  tsTranspileOptions?: TSTranspileOptions;
}

interface AppSyncAssetHelperConfigBase extends AssetHelperConfig {
  buildMode: BuildMode
  tsConfig: string; // path to tsconfig.json to be used for linting
}

export interface AppSyncAssetHelperConfigNoBuild extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Off;
  tsTranspileOptions?: undefined;
  esBuildOptions?: undefined;
}

export interface AppSyncAssetHelperConfigTS extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Typescript;
  tsTranspileOptions?: TSTranspileOptions;
  esBuildOptions?: undefined;
}

export interface AppSyncAssetHelperConfigES extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Esbuild;
  tsTranspileOptions?: undefined;
  esBuildOptions?: ESBuildOptions;
}

export enum BuildMode {
  Off,
  Typescript,
  Esbuild,
}

const tsGetTranspiledCode = (sourceFilePath: string, tsTranspileOptions: TSTranspileOptions) => {

  const { compilerOptions, ...otherOptions } = tsTranspileOptions;

  console.log('Transpiling with TypeScript sourceFilePath:', sourceFilePath);

  // Transpile the source ts code into js code
  const tsSourceCode = fs.readFileSync(sourceFilePath, 'utf8');

  console.log('Transpiling with TypeScript:', tsSourceCode);

  const result = transpileModule(tsSourceCode, {
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
  });

  console.log('Transpiling with TypeScript diagnostics:', result.diagnostics, result.outputText);

  return result.outputText;
};

export const tsTranspiling = (sourceFilePath: string, outputFilePath: string, tsTranspileOptions: TSTranspileOptions = {}) => {

  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(sourceFilePath, tsTranspileOptions);

  // Write the transpiled file to the output directory
  fs.writeFileSync(outputFilePath, transpiledCode);

  console.log('Transpiling with TypeScript:', {
    source: sourceFilePath,
    output: outputFilePath
  });

  return outputFilePath;
};

export const esbuildBuilding = (options: {
  sourceFilePath: string,
  outputFilePath: string,
  buildOptions?: ESBuildOptions
}) => {

  // Build the source file with esbuild and write it to the output directory
  // as a CommonJS module

  let buildResult = buildSync({
    outfile: options.outputFilePath,
    entryPoints: [options.sourceFilePath],
    ...options.buildOptions
  });

  console.log('Building with esbuild:', {
    source: options.sourceFilePath,
    output: options.outputFilePath,
    buildErrors: buildResult.errors,
    buildWarnings: buildResult.warnings
  });

  return options.outputFilePath;
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