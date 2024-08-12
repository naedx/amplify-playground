import { Context } from "@aws-appsync/utils";

export const testContextBase: Context = {
  args: undefined,
  env: {},
  arguments: undefined,
  identity: undefined,
  stash: {},
  result: undefined,
  prev: undefined,
  request: {
    headers: undefined,
    domainName: null
  },
  info: {
    fieldName: '',
    parentTypeName: '',
    variables: {},
    selectionSetList: [],
    selectionSetGraphQL: ''
  }
};

export function createTestContext<T>(args: T, result: any = undefined): Context<T> {
  return {
    ...testContextBase,
    arguments: args,
    args,
    result
  };
}

export function createTestContextForEvaluate<T>(args: T, result: any = undefined): Omit<Context<T>, "info"> {
  const context = createTestContext(args, result);

  const { info, ...rest } = context;

  return rest;
}