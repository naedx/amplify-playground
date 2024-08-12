import { Context, util } from '@aws-appsync/utils';

export function request(ctx: Context) {
  const { content } = ctx.args.input;

  const consolidatedValues = {
    content
  };

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({ id: util.autoId() }),
    attributeValues: util.dynamodb.toMapValues(consolidatedValues),
  }
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
