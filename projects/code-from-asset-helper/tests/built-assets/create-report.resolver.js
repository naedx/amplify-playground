// tests/create-report.resolver.ts
import { util as util2 } from "@aws-appsync/utils";

// tests/helpers.ts
import { util } from "@aws-appsync/utils";
var isAppSyncIdentityCognito = (identity) => {
  if (identity && identity.sub && identity.username) {
    return true;
  }
  return false;
};
function getLoggedInUserId(ctx) {
  if (isAppSyncIdentityCognito(ctx.identity)) {
    return ctx.identity.sub;
  }
  util.error("NotCognitoIdentity: Not a cognito identity");
}

// tests/create-report.resolver.ts
function request(ctx) {
  const metaData = {
    createdBy: getLoggedInUserId(ctx),
    createdAt: util2.time.nowISO8601()
  };
  const values = ctx.args.input;
  return {
    operation: "PutItem",
    key: util2.dynamodb.toMapValues({ id: util2.autoId() }),
    attributeValues: util2.dynamodb.toMapValues({
      ...values,
      ...metaData
    })
  };
}
function response(ctx) {
  if (ctx.error) {
    util2.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vY3JlYXRlLXJlcG9ydC5yZXNvbHZlci50cyIsICIuLi9oZWxwZXJzLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQWtCLFFBQUFBLGFBQVk7OztBQ0E5QixTQUEwQyxZQUFZO0FBSS9DLElBQU0sMkJBQTJCLENBQUMsYUFBc0Q7QUFDN0YsTUFBSSxZQUFZLFNBQVMsT0FBTyxTQUFTLFVBQVU7QUFDakQsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGtCQUFrQixLQUFjO0FBRTlDLE1BQUkseUJBQXlCLElBQUksUUFBUSxHQUFHO0FBQzFDLFdBQU8sSUFBSSxTQUFTO0FBQUEsRUFDdEI7QUFFQSxPQUFLLE1BQU0sNENBQTRDO0FBQ3pEOzs7QURoQk8sU0FBUyxRQUFRLEtBQThCO0FBRXBELFFBQU0sV0FBZ0M7QUFBQSxJQUNwQyxXQUFXLGtCQUFrQixHQUFHO0FBQUEsSUFDaEMsV0FBV0MsTUFBSyxLQUFLLFdBQVc7QUFBQSxFQUNsQztBQUVBLFFBQU0sU0FBUyxJQUFJLEtBQUs7QUFFeEIsU0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsS0FBS0EsTUFBSyxTQUFTLFlBQVksRUFBRSxJQUFJQSxNQUFLLE9BQU8sRUFBRSxDQUFDO0FBQUEsSUFDcEQsaUJBQWlCQSxNQUFLLFNBQVMsWUFBWTtBQUFBLE1BQ3pDLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxJQUNMLENBQUM7QUFBQSxFQUVIO0FBQ0Y7QUFFTyxTQUFTLFNBQVMsS0FBYztBQUNyQyxNQUFJLElBQUksT0FBTztBQUNiLElBQUFBLE1BQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQzlDO0FBRUEsU0FBTyxJQUFJO0FBQ2I7IiwKICAibmFtZXMiOiBbInV0aWwiLCAidXRpbCJdCn0K
