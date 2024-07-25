
import { util } from '@aws-appsync/utils';
import { describe, expect, test } from 'vitest';

describe('Use AppSync @aws-appsync/utils', () => {

  test('util should not be empty', () => {
    console.log(util);
    expect(util).not.toMatchObject({});
  });

  test('util.autoId() should be a function', () => {

    expect(util?.autoId).toBeTypeOf('function');

    const id = util.autoId();

    expect(id).toBeDefined();
  });

  test('util.time.nowISO8601() should produce a date', () => {

    expect(util.time.nowISO8601).toBeTypeOf('function');

    const t = util.time.nowISO8601();

    console.log(`Generated time: ${t}`);

    expect(t).toBeDefined();
  });

});
