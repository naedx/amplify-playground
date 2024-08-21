

import path from 'path';
import { describe, expect, test } from 'vitest';
import { esbuildBuilding, esLinting, tsTranspiling } from '../lib/backend.utils';

import { BuildOptions as ESBuildOptions } from 'esbuild';

import fs from 'fs';

describe('appsync builder', () => {

  test('resolver should fail linting', async () => {

    const sourceFilePath = path.resolve('./tests/create-report.fail.resolver.ts');

    expect(async () => {
      const lintResult = await esLinting(sourceFilePath, path.resolve('./tests/tsconfig.json'));

    }).rejects.toThrow('2 linting error(s)');

  });

  test('esbuild should create output', async () => {

    const sourceFilePath = path.resolve('./tests/create-report.resolver.ts');

    const outputDir = path.resolve(`./tests/built-assets/asset.${getRandomInt(10000, 99999)}`);

    esLinting(sourceFilePath, path.resolve('./tests/tsconfig.json'));

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
    };

    const outFile = await esbuildBuilding({
      sourceFilePath,
      outputFilePath: path.join(outputDir, path.basename(sourceFilePath).replace('.ts', '.js')),
      buildOptions: esBuildOptions
    });

    expect(outFile).not.toBeNull();

    const assetCreated = fs.existsSync(outFile);

    expect(assetCreated).toBe(true);

  });

  test('tsTranspiling should create output', async () => {

    const sourceFilePath = path.resolve('./tests/create-report.resolver.ts');

    const outputDir = path.resolve(`./tests/built-assets/asset.${getRandomInt(10000, 99999)}`);

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    esLinting(sourceFilePath, path.resolve('./tests/tsconfig.json'));

    const outFile = tsTranspiling(sourceFilePath, path.join(outputDir, path.basename(sourceFilePath).replace('.ts', '.js')))

    expect(outFile).not.toBeNull();

    const assetCreated = fs.existsSync(outFile);

    expect(assetCreated).toBe(true);

  });

});

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

