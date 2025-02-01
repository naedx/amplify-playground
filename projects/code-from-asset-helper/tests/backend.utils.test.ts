import path from "path";
import { describe, expect, test } from "vitest";
import {
  BuildMode,
  esbuildBuilding,
  esLinting,
  lintNestedFiles,
  tsTranspiling,
} from "../lib/backend.utils";

import { BuildOptions as ESBuildOptions } from "esbuild";

import fs from "fs";

describe("appsync builder", () => {
  test("resolver should fail linting", async () => {
    const sourceFilePath = path.resolve(
      "./tests/create-report.fail.resolver.ts"
    );

    await expect(async () => {
      const lintResult = await esLinting({
        source: "appsync",
        sourceFilePath,
        overrideEslintConfig: {
          languageOptions: {
            parserOptions: {
              project: path.resolve("./tests/tsconfig.json"),
            },
          },
        },
        debugSource: sourceFilePath,
      });

      if (lintResult !== false) {
        throw Error(lintResult);
      }
    }).rejects.toThrow("3 linting error(s)");
  });

  test("esbuild should create output", async () => {
    const sourceFilePath = path.resolve("./tests/create-report.resolver.ts");

    const outputDir = path.resolve(
      `./tests/built-assets/asset.${getRandomInt(10000, 99999)}`
    );

    esLinting({
      source: "appsync",
      sourceFilePath,
      overrideEslintConfig: {
        languageOptions: {
          parserOptions: {
            project: path.resolve("./tests/tsconfig.json"),
          },
        },
      },
      debugSource: sourceFilePath,
    });

    //AppSync function build
    const esBuildOptions: ESBuildOptions = {
      sourcemap: "inline",
      sourcesContent: false,
      format: "esm",
      target: "esnext",
      platform: "node",
      external: [
        "@aws-appsync/utils",
        "@aws-sdk/client-s3",
        "@aws-sdk/s3-request-presigner",
      ],
      bundle: true,
    };

    const buildOutput = await esbuildBuilding({
      sourceFilePath,
      outputFilePath: path.join(
        outputDir,
        path.basename(sourceFilePath).replace(".ts", ".js")
      ),
      buildOptions: esBuildOptions,
    });

    expect(buildOutput.outputFilePath).not.toBeNull();

    const assetCreated = fs.existsSync(buildOutput.outputFilePath);

    expect(assetCreated).toBe(true);
  });

  test("tsTranspiling should create output", async () => {
    const sourceFilePath = path.resolve("./tests/create-report.resolver.ts");

    const outputDir = path.resolve(
      `./tests/built-assets/asset.${getRandomInt(10000, 99999)}`
    );

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    esLinting({
      source: "appsync",
      sourceFilePath,
      overrideEslintConfig: {
        languageOptions: {
          parserOptions: {
            project: path.resolve("./tests/tsconfig.json"),
          },
        },
      },
      debugSource: sourceFilePath,
    });

    const outFile = tsTranspiling(
      sourceFilePath,
      path.join(outputDir, path.basename(sourceFilePath).replace(".ts", ".js"))
    );

    expect(outFile).not.toBeNull();

    const assetCreated = fs.existsSync(outFile);

    expect(assetCreated).toBe(true);
  });
});

test("esbuild should detect errors in nested files", async () => {
  const sourceFilePath = path.resolve("./tests/create-report.resolver.ts");

  const outputDir = path.resolve(
    `./tests/built-assets/asset.${getRandomInt(10000, 99999)}`
  );

  const overrideConfig = {
    languageOptions: {
      parserOptions: {
        project: path.resolve("./tests/tsconfig.json"),
      },
    },
  };

  esLinting({
    source: "appsync",
    sourceFilePath,
    overrideEslintConfig: overrideConfig,
    debugSource: sourceFilePath,
  });

  //AppSync function build
  const esBuildOptions: ESBuildOptions = {
    sourcemap: "inline",
    sourcesContent: false,
    format: "esm",
    target: "esnext",
    platform: "node",
    external: [
      "@aws-appsync/utils",
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-request-presigner",
    ],
    bundle: true,
  };

  const buildOutput = await esbuildBuilding({
    sourceFilePath,
    outputFilePath: path.join(
      outputDir,
      path.basename(sourceFilePath).replace(".ts", ".js")
    ),
    buildOptions: esBuildOptions,
  });

  await expect(async () => {
    await lintNestedFiles(buildOutput.nestedLocalImports, "appsync", {
      buildMode: BuildMode.Esbuild,
      esBuildOptions,
      overrideEslintConfig: overrideConfig,
    });
  }).rejects.toThrow("2 nested file(s) have errors.");
});

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
