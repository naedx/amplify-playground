

import path from 'path';
import { describe, expect, test } from 'vitest';
import { esbuildBuilding, esLinting } from '../lib/backend.utils';

import { BuildOptions as ESBuildOptions } from 'esbuild';

import fs from 'fs';

describe('appsync builder', () => {
  test('esbuild should create output', async () => {

    const sourceFilePath = path.resolve('./tests/create-report.resolver.ts');

    esLinting(sourceFilePath);

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
      // ...config.esBuildOptions
    };

    const outFile = await esbuildBuilding(
      sourceFilePath,
      path.resolve('./tests/built-assets/'),
      path.basename(sourceFilePath).replace('.ts', '.js'),
      esBuildOptions
    );

    expect(outFile).not.toBeNull();

    const assetCreated = fs.existsSync(outFile);

    expect(assetCreated).toBe(true);



  })
  // test('should create asset', () => {
  //   const result = appSyncCodeFromAssetHelper(path.resolve('./tests/create-report.resolver.ts'), {
  //     buildMode: BuildMode.Esbuild,
  //   });

  //   expect(result).not.toBeNull();

  //   console.log(result);
  // });
});
