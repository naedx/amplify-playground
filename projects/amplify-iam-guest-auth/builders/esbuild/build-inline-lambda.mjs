/* eslint-disable */
// This file configures esbuild for the AppSync typescript resolvers
// Task: watch:ts-resolvers

import { build, context } from 'esbuild';
import eslint from 'esbuild-plugin-eslint';

const catchWarningsAndErrorsPlugin = {
  name: 'catch-warnings-and-errors',
  setup(build) {
    let count = 0;
    build.onEnd(result => {
      count++;

      if (result?.warnings?.length > 0) {
        console.log(`Warnings [${count}]:`, result?.warnings);
      }

      if (result?.errors?.length > 0) {
        console.log(`Errors [${count}]:`, result?.errors);
      }

    });
  },
};

const config = {
  sourcemap: 'inline',
  sourcesContent: false,

  format: 'cjs',
  target: 'esnext',
  platform: 'node',
  external: [
    'aws-lambda',
    '@aws-sdk/*',
    '@aws-sdk/client-s3',
    '@aws-sdk/client-appsync',
    '@aws-sdk/s3-request-presigner',
    '@aws-sdk/client-rekognition'
  ],
  outExtension: {
    '.js': '.cjs'
  },
  outbase: 'amplify/data',
  outdir: 'amplify/data',
  entryPoints: [
    'amplify/data/features/**/*.lambda.ts',
    // 'amplify/data/features/**/*.lambda/*.ts'
  ],
  bundle: true,
  plugins: [
    eslint({
      useEslintrc: false,
      overrideConfigFile: 'amplify/data/.eslintrc.lambda.json'
    })
  ],
};

let mode = 'build';

if (process.argv.length > 2 && process.argv[2] === '--watch') {
  mode = 'watch';
}

if (mode === 'build') {
  await build(config);
}
else {
  async function watch() {
    config.plugins = [...config.plugins, catchWarningsAndErrorsPlugin];

    let ctx = await context(config);

    await ctx.watch();

    // await ctx.dispose();

    console.log(`Watching...`);
  }

  await watch();

}
