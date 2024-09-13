// amplify/data/features/post/post.resolver.ts
import { util } from "@aws-appsync/utils";
function request(ctx) {
  const metaData = {
    createdBy: "UNAUTH",
    createdAt: util.time.nowISO8601()
  };
  const { name, subject, message, formId } = ctx.args.input;
  const consolidatedValues = {
    name,
    subject,
    message,
    formId,
    ...metaData,
    type: "Post"
  };
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({ id: util.autoId() }),
    attributeValues: util.dynamodb.toMapValues(consolidatedValues)
  };
}
function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29udGFjdC1mb3JtLnJlc29sdmVyLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQWtCLFlBQVk7QUFJdkIsU0FBUyxRQUFRLEtBQTJDO0FBRWpFLFFBQU0sV0FBZ0M7QUFBQSxJQUNwQyxXQUFXO0FBQUEsSUFDWCxXQUFXLEtBQUssS0FBSyxXQUFXO0FBQUEsRUFDbEM7QUFFQSxRQUFNLEVBQUUsTUFBTSxTQUFTLFNBQVMsT0FBTyxJQUFJLElBQUksS0FBSztBQUVwRCxRQUFNLHFCQUE4QztBQUFBLElBQ2xEO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxHQUFHO0FBQUEsSUFDSCxNQUFNO0FBQUEsRUFDUjtBQUVBLFNBQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxJQUNYLEtBQUssS0FBSyxTQUFTLFlBQVksRUFBRSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUM7QUFBQSxJQUNwRCxpQkFBaUIsS0FBSyxTQUFTLFlBQVksa0JBQWtCO0FBQUEsRUFDL0Q7QUFDRjtBQUVPLFNBQVMsU0FBUyxLQUFpQztBQUN4RCxNQUFJLElBQUksT0FBTztBQUNiLFNBQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQzlDO0FBRUEsU0FBTyxJQUFJO0FBQ2I7IiwKICAibmFtZXMiOiBbXQp9Cg==
