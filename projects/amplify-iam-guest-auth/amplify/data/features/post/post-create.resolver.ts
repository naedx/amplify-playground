import { Context, util } from '@aws-appsync/utils';
import { CreateModelMetaData } from '../../common/helpers';
import type { CreatePostInput, CreatePostResult, Post, PostType } from '../../schema/generated/schema';

export function request(ctx: Context<{ input: CreatePostInput }>) {

  const metaData: CreateModelMetaData = {
    createdBy: 'UNAUTH',
    createdAt: util.time.nowISO8601(),
  };

  const { name, subject, message, formId } = ctx.args.input;

  const consolidatedValues: Omit<Post, 'id'> = {
    name,
    subject,
    message,
    formId,
    ...metaData,
    type: 'Post' as PostType,
  }

  return {
    operation: 'PutItem',
    key: util.dynamodb.toMapValues({ id: util.autoId() }),
    attributeValues: util.dynamodb.toMapValues(consolidatedValues),
  };
}

export function response(ctx: Context): CreatePostResult {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  return ctx.result;
}
