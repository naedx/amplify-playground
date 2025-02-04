import { Context, util } from "@aws-appsync/utils";
import { CreateModelMetaData, getLoggedInUserId } from "./helpers";
import { addition } from "./utils.fail.resolver"; // This nested function should fail linting

export function request(ctx: Context<{ input: object }>) {
  const metaData: CreateModelMetaData = {
    createdBy: getLoggedInUserId(ctx),
    createdAt: util.time.nowISO8601(),
  };

  const values = ctx.args.input;

  console.log(addition(1, 2));

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({ id: util.autoId() }),
    attributeValues: util.dynamodb.toMapValues({
      ...values,
      ...metaData,
    }),
  };
}

export function response(
  ctx: Context<unknown, Record<string, unknown>, undefined, undefined, unknown>
) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
