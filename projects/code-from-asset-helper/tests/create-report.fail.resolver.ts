import { Context, util } from '@aws-appsync/utils';
import { CreateModelMetaData, getLoggedInUserId } from './helpers';

export async function request(ctx: Context<{ input: any }>) {

  const metaData: CreateModelMetaData = {
    createdBy: await getLoggedInUserId(ctx),
    createdAt: util.time.nowISO8601(),
  };

  const values = ctx.args.input;

  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({ id: util.autoId() }),
    attributeValues: util.dynamodb.toMapValues({
      ...values,
      ...metaData
    }),

  };
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
