
import { util } from '@aws-appsync/utils';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@aws-appsync/utils', () => {

  const originalAppSyncUtils = require('@aws-appsync/utils');
  const { marshall } = require('@aws-sdk/util-dynamodb');
  const { v4 } = require('uuid');

  return {
    ...originalAppSyncUtils,
    util: {
      error: (msg: string | undefined) => { throw new Error(msg) },
      autoId: () => v4(),
      dynamodb: {
        toMapValues: (val: any) => { return marshall(val); }
      },
      time: {
        nowEpochSeconds: () => Math.floor(Date.now() / 1000),
        nowISO8601: () => new Date().toISOString()
      }
    }
  }
});

describe('Use AppSync @aws-appsync/utils', () => {

  test('util should not be empty', () => {
    console.log(util);
    expect(util).not.toMatchObject({});
  });

  test('util.autoId() should be a function', () => {

    expect(util?.autoId).toBeTypeOf('function');

    const id = util.autoId();

    expect(id).toBeDefined();

    expect(id).toBeTypeOf('string');
  });

  test('util.time.nowISO8601() should produce a date', () => {

    expect(util.time.nowISO8601).toBeTypeOf('function');

    const t = util.time.nowISO8601();

    console.log(`Generated time: ${t}`);

    expect(t).toBeDefined();

    expect(t).toBeTypeOf('string');
  });

});
