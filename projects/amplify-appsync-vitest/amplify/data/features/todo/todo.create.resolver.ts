import { Context, util } from '@aws-appsync/utils';

export function request(ctx: Context) {
  const { id } = ctx.args;

  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({ id }),
    consistentRead: false
  }
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
