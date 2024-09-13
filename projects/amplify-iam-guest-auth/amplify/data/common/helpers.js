// amplify/data/common/helpers.ts
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
function validateEnvironmentVariables(...variables) {
  const missingVariables = variables.filter((variable) => !process.env[variable]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(", ")}`);
  }
}
export {
  addResourceTags,
  getLoggedInUserId,
  isAppSyncIdentityCognito,
  validateEnvironmentVariables
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaGVscGVycy50cyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUEwQyxZQUFZO0FBSS9DLElBQU0sMkJBQTJCLENBQUMsYUFBc0Q7QUFDN0YsTUFBSSxZQUFZLFNBQVMsT0FBTyxTQUFTLFVBQVU7QUFDakQsV0FBTztBQUFBLEVBQ1Q7QUFFQSxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGtCQUFrQixLQUFjO0FBRTlDLE1BQUkseUJBQXlCLElBQUksUUFBUSxHQUFHO0FBQzFDLFdBQU8sSUFBSSxTQUFTO0FBQUEsRUFDdEI7QUFFQSxPQUFLLE1BQU0sNENBQTRDO0FBQ3pEO0FBb0JPLFNBQVMsZ0JBQWdCLGFBQXVEO0FBRXJGLGNBQVksb0JBQW9CLFFBQVE7QUFBQSxJQUN0QztBQUFBLE1BQ0UsS0FBSztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGLENBQUM7QUFFSDtBQUVPLFNBQVMsZ0NBQWdDLFdBQXFCO0FBQ25FLFFBQU0sbUJBQW1CLFVBQVUsT0FBTyxjQUFZLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztBQUU1RSxNQUFJLGlCQUFpQixTQUFTLEdBQUc7QUFDL0IsVUFBTSxJQUFJLE1BQU0sa0NBQWtDLGlCQUFpQixLQUFLLElBQUksQ0FBQyxFQUFFO0FBQUEsRUFDakY7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
