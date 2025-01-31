import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from "aws-cdk-lib/aws-lambda";

import { Code as AppSyncCode } from "aws-cdk-lib/aws-appsync";

import path from "path";

import os from "os";

import tseslint from "typescript-eslint";

import { buildSync, BuildOptions as ESBuildOptions } from "esbuild";
import { ESLint, Linter } from "eslint";
import fs from "fs";
import {
  ModuleKind,
  ScriptTarget,
  transpileModule,
  TranspileOptions as TSTranspileOptions,
} from "typescript";

import eslint from "@eslint/js";

import appsyncPlugin from "@aws-appsync/eslint-plugin";

import { BundlingOutput } from "aws-cdk-lib/core";

import globals from "globals";

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
  return (await fromAssetHelper(
    sourceFilePath,
    config,
    "lambda"
  )) as LambdaCode;
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
  config:
    | AppSyncAssetHelperConfigNoBuild
    | AppSyncAssetHelperConfigTS
    | AppSyncAssetHelperConfigES
): Promise<AppSyncCode> {
  return (await fromAssetHelper(
    sourceFilePath,
    config,
    "appsync"
  )) as AppSyncCode;
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
async function fromAssetHelper(
  sourceFilePath: string,
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase,
  codeType: "lambda" | "appsync",
  returnAsString: boolean = false
): Promise<AppSyncCode | LambdaCode | string> {
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

  try {
    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`The source file does not exist: ${sourceFilePath}`);
    }

    const builtSourcePath = await build(config, sourceFilePath, codeType);

    if (!fs.existsSync(builtSourcePath)) {
      throw new Error(`The source file was not found: ${sourceFilePath}`);
    }

    if (returnAsString) {
      return fs.readFileSync(builtSourcePath, "utf8");
    }

    const code = codeType === "lambda" ? LambdaCode : AppSyncCode;

    const asset = code.fromAsset(path.dirname(builtSourcePath), {
      bundling: {
        image: LambdaRuntime.NODEJS_20_X.bundlingImage,
        command: [
          "node",
          "-e",
          `require('node:fs').copyFileSync("/asset-input/${path.basename(
            builtSourcePath
          )}", 
          "/asset-output/index.js")`,
        ],
        outputType:
          codeType === "appsync" ? BundlingOutput.SINGLE_FILE : undefined,
        local: {
          tryBundle(outputDir: string) {
            // create output directory if it doesn't yet exist
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

            try {
              //copy the built file to the output directory
              fs.copyFileSync(
                builtSourcePath,
                path.join(outputDir, path.basename(builtSourcePath))
              );
            } catch (ex) {
              console.error("Error copying built file to output: ", ex);
              throw ex; // rethrow error to prevent falling back to the docker build mode
            }

            return true;
          },
        },
      },
    });

    return asset;
  } catch (e: unknown) {
    throw new Error((e as Error).message);
  }
}

export interface AssetHelperConfig {
  buildMode: BuildMode;
  esBuildOptions?: ESBuildOptions;
  tsTranspileOptions?: TSTranspileOptions;
  overrideEslintConfig?: OverridesConfigType;
}

interface AppSyncAssetHelperConfigBase extends AssetHelperConfig {
  buildMode: BuildMode;
}

export interface AppSyncAssetHelperConfigNoBuild
  extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Off;
  tsTranspileOptions?: undefined;
  esBuildOptions?: undefined;
}

export interface AppSyncAssetHelperConfigTS
  extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Typescript;
  tsTranspileOptions?: TSTranspileOptions;
  esBuildOptions?: undefined;
}

export interface AppSyncAssetHelperConfigES
  extends AppSyncAssetHelperConfigBase {
  buildMode: BuildMode.Esbuild;
  tsTranspileOptions?: undefined;
  esBuildOptions?: ESBuildOptions;
}

export enum BuildMode {
  Off,
  Typescript,
  Esbuild,
}

const tsGetTranspiledCode = (
  sourceFilePath: string,
  tsTranspileOptions: TSTranspileOptions
) => {
  const { compilerOptions, ...otherOptions } = tsTranspileOptions;

  // Transpile the source ts code into js code
  const tsSourceCode = fs.readFileSync(sourceFilePath, "utf8");

  const result = transpileModule(tsSourceCode, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2020,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      ...compilerOptions,
    },
    ...otherOptions,
  });

  return result.outputText;
};

export const tsTranspiling = (
  sourceFilePath: string,
  outputFilePath: string,
  tsTranspileOptions: TSTranspileOptions = {}
): string => {
  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(
    sourceFilePath,
    tsTranspileOptions
  );

  // Write the transpiled file to the output directory
  fs.writeFileSync(outputFilePath, transpiledCode);

  return outputFilePath;
};

export const esbuildBuilding = (options: {
  sourceFilePath: string;
  outputFilePath: string;
  buildOptions?: ESBuildOptions;
}): { outputFilePath: string; nestedLocalImports: string[] } => {
  // Build the source file with esbuild and write it to the output directory
  // as a CommonJS module

  const buildResult = buildSync({
    outfile: options.outputFilePath,
    entryPoints: [options.sourceFilePath],
    metafile: true,
    ...options.buildOptions,
  });

  const nestedImports = Object.entries(buildResult.metafile?.inputs ?? {})
    .filter(function (entry) {
      const [key] = entry;

      return (
        key.includes("node_modules") === false &&
        key.endsWith(".ts") &&
        key.endsWith("generated.ts") === false
      );
    })
    .map((e) => e[0]);

  return {
    nestedLocalImports: nestedImports,
    outputFilePath: options.outputFilePath,
  };
};

export type EsLintingArgsType = EsLintingFilesArgsType | EsLintingTextArgsType;

export type EsLintingFilesArgsType = {
  source: "appsync" | "lambda";
  sourceFilePath: string;
  overrideEslintConfig?: OverridesConfigType;
};

export type EsLintingTextArgsType = {
  source: "appsync" | "lambda";
  sourceText: string;
  overrideEslintConfig?: OverridesConfigType;
};

export const esLinting = async (
  args: EsLintingArgsType
): Promise<string | false> => {
  //setup base config for appsync or lambda

  const eslint = new ESLint({
    ...getEslintBaseConfig(args.source),
    overrideConfig: args.overrideEslintConfig,
  });

  let lintResults: ESLint.LintResult;

  if ((args as EsLintingFilesArgsType).sourceFilePath !== undefined) {
    const argsAsFiles = args as EsLintingFilesArgsType;

    lintResults = (await eslint.lintFiles([argsAsFiles.sourceFilePath]))[0];
  } else {
    const argsAsText = args as EsLintingTextArgsType;

    lintResults = (await eslint.lintText(argsAsText.sourceText))[0];
  }

  if (lintResults.errorCount > 0) {
    const messages = [
      ...lintResults.messages,
      ...lintResults.suppressedMessages,
    ].map((m) => {
      let errorMessage = "";

      if (m.ruleId !== null) {
        errorMessage = `:: Lint Rule Error ::\n`;
      } else if (m.fatal) {
        errorMessage = `:: Fatal Error ::\n`;
      } else {
        errorMessage = `:: Error ::\n`;
      }

      if (m.ruleId) errorMessage += `Rule: ${m.ruleId}\n`;
      if (m.severity) errorMessage += `Severity: ${m.severity}\n`;
      if (m.message) errorMessage += `Message: ${m.message}\n`;
      if (m.line)
        errorMessage += `Location: line ${m.line}:${m.column} ${
          m.endLine && m.endColumn ? "to " + m.endLine + ":" + m.endColumn : ""
        }\n`;
      if (m.fix) errorMessage += `Fix: ${m.fix.text}.`;
      if (m.suggestions)
        errorMessage += `Suggestion(s): ${m.suggestions.join(". ")}.`;

      return errorMessage;
    });

    const fullErrorMessage = `${
      lintResults.errorCount
    } linting error(s) found:: \n\n${messages.join("\n\n")}\n\n\n`;

    return fullErrorMessage;
  }

  return false;
};

function getEslintBaseConfig(source: "appsync" | "lambda"): ESLint.Options {
  const baseConfigs = tseslint.config(
    ...[eslint.configs.recommended, tseslint.configs.recommended]
  ) as Linter.Config[];

  return source === "appsync"
    ? {
        // plugins: {
        //   "@typescript-eslint": tseslintPlugin,
        // },
        baseConfig: [
          {
            languageOptions: {
              globals: {
                ...globals.node,
              },
              parserOptions: {
                projectService: {
                  allowDefaultProject: ["__placeholder__.js"],
                },
              },
            },
          },
          ...baseConfigs,
          appsyncPlugin.configs?.recommended as Linter.Config,
        ],
      }
    : {
        // plugins: {
        //   "@typescript-eslint": tseslintPlugin,
        // },
        baseConfig: [
          {
            languageOptions: {
              globals: {
                ...globals.node,
              },
              parserOptions: {
                projectService: {
                  allowDefaultProject: ["__placeholder__.js"],
                },
              },
            },
          },
          ...(baseConfigs as Linter.Config[]),
        ],
      };
}

async function build(
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase,
  sourceFilePath: string,
  codeType: "lambda" | "appsync"
): Promise<string> {
  const tempDir = os.tmpdir();

  const outputDir = path.join(
    tempDir,
    "code-from-asset-helper",
    `asset.${getRandomInt(10000, 99999)}`
  );

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName =
    codeType === "appsync"
      ? path.basename(sourceFilePath).replace(path.extname(sourceFilePath), "")
      : "index";

  //pre-build linting
  await lintHelper({
    codeType,
    sourceFilePath,
    config,
    debugSource: sourceFilePath,
  });

  switch (config.buildMode) {
    case BuildMode.Off: {
      // if the source file is already js
      const outfilePath = path.join(outputDir, `${fileName}.js`);
      fs.copyFileSync(sourceFilePath, outfilePath);
      return outfilePath;
    }
    case BuildMode.Typescript: {
      // if choosing Typescript transpiler
      return tsTranspiling(
        sourceFilePath,
        path.join(outputDir, `${fileName}.js`)
      );
    }
    case BuildMode.Esbuild: {
      // if choosing ESbuild transpiler
      const esConfig = config as AppSyncAssetHelperConfigES;

      //lambda build
      const commonOptions: ESBuildOptions = {
        platform: "node",
        bundle: true,
        target: "esnext",
      };

      // const eslintPluginConfig = {
      //   baseConfig: getEslintBaseConfig(codeType),
      //   overrideConfig: config.overrideEslintConfig,
      // };

      switch (codeType) {
        case "lambda": {
          const buildOutput = esbuildBuilding({
            sourceFilePath: sourceFilePath,
            outputFilePath: path.join(outputDir, `${fileName}.cjs`),
            buildOptions: {
              ...commonOptions,
              format: "cjs",
              external: ["aws-lambda", "@aws-sdk/*"],
              outExtension: {
                ".js": ".cjs",
              },
              // plugins: [eslintPlugin(eslintPluginConfig as ESLint.Options)], // perform linting of build artifacts
              ...esConfig.esBuildOptions, // apply user defined overrides
            },
          });

          // post-build linting
          await lintNestedFiles(
            buildOutput.nestedLocalImports,
            codeType,
            config
          );

          return buildOutput.outputFilePath;
        }

        case "appsync": {
          const buildOutput = esbuildBuilding({
            sourceFilePath: sourceFilePath,
            outputFilePath: path.join(outputDir, `${fileName}.js`),
            buildOptions: {
              ...commonOptions,
              format: "esm",
              external: [
                "@aws-appsync/utils",
                "@aws-sdk/client-s3",
                "@aws-sdk/s3-request-presigner",
              ],
              // plugins: [eslintPlugin(eslintPluginConfig as ESLint.Options)], // perform linting of build artifacts
              ...esConfig.esBuildOptions, // apply user defined overrides
            },
          });

          // post-build linting
          await lintNestedFiles(
            buildOutput.nestedLocalImports,
            codeType,
            config
          );

          return buildOutput.outputFilePath;
        }

        default:
          throw new Error(`Invalid value for 'codeType': ${codeType}`);
      }
    }
    default:
      throw new Error(`Invalid value for 'buildMode': ${config.buildMode}`);
  }
}

type LintHelperArgsType = (
  | LintHelperArgsForFileType
  | LintHelperArgsForTextType
) & { debugSource: string };

type LintHelperArgsForFileType = {
  codeType: string;
  sourceFilePath: string;
  sourceText?: string;
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase;
};

type LintHelperArgsForTextType = {
  codeType: string;
  sourceFilePath?: string;
  sourceText: string;
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase;
};

export async function lintNestedFiles(
  nestedLocalImports: string[],
  codeType: string,
  config: AssetHelperConfig | AppSyncAssetHelperConfigBase
) {
  const nestImportLintFailures: string[] = [];

  for (const nestedImport of nestedLocalImports) {
    try {
      const builtFileText = fs.readFileSync(nestedImport, "utf8");

      await lintHelper({
        codeType,
        sourceText: builtFileText,
        config,

        debugSource: nestedImport,
      });
    } catch (e: unknown) {
      nestImportLintFailures.push((e as Error).message);
    }
  }

  if (nestImportLintFailures.length > 0) {
    const m = `${
      nestImportLintFailures.length
    } nested file(s) have errors. \n\n${nestImportLintFailures.join("\n\n")}`;

    throw new Error(m);
  }
}

async function lintHelper(args: LintHelperArgsType) {
  const lintSourceConfig = args.sourceFilePath
    ? {
        sourceFilePath: (args as LintHelperArgsForFileType).sourceFilePath,
      }
    : {
        sourceText: (args as LintHelperArgsForTextType).sourceText,
      };

  if (args.codeType === "appsync") {
    //perform linting if the code is for AppSync
    const result = await esLinting({
      source: "appsync",
      overrideEslintConfig: args.config.overrideEslintConfig,

      ...lintSourceConfig,
    });

    if (result !== false) {
      const errorMessage = `The AppSync source file was not built successfully (2): ${args.debugSource}\n\n${result}\n\n`;
      throw new Error(errorMessage);
    }
  } else {
    const result = await esLinting({
      source: "lambda",
      overrideEslintConfig: args.config.overrideEslintConfig,

      ...lintSourceConfig,
    });

    if (result !== false) {
      const errorMessage = `The Lambda source file was not built successfully (3): ${args.debugSource}\n\n${result}\n\n`;
      throw new Error(errorMessage);
    }
  }
}

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

/**
 * This utility function is used to produce the inline code string from a local file.
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
 * @returns A string of the build code
 */
export async function inlineAppSyncCodeFromAssetHelper(
  sourceFilePath: string,
  config: AssetHelperConfig
): Promise<string> {
  return (await fromAssetHelper(
    sourceFilePath,
    config,
    "appsync",
    true
  )) as string;
}

export type OverridesConfigType =
  | Linter.Config
  | Linter.Config[]
  | null
  | undefined;
