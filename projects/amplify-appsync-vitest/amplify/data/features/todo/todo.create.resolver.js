// amplify/data/features/reporting/comment/todo.create.resolver.ts
import { util } from "@aws-appsync/utils";
function request(ctx) {
  const { id } = ctx.args;
  return {
    operation: "GetItem",
    key: util.dynamodb.toMapValues({ id }),
    consistentRead: false
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidG9kby5jcmVhdGUucmVzb2x2ZXIudHMiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBa0IsWUFBWTtBQUV2QixTQUFTLFFBQVEsS0FBYztBQUNwQyxRQUFNLEVBQUUsR0FBRyxJQUFJLElBQUk7QUFFbkIsU0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsS0FBSyxLQUFLLFNBQVMsWUFBWSxFQUFFLEdBQUcsQ0FBQztBQUFBLElBQ3JDLGdCQUFnQjtBQUFBLEVBQ2xCO0FBQ0Y7QUFFTyxTQUFTLFNBQVMsS0FBYztBQUNyQyxNQUFJLElBQUksT0FBTztBQUNiLFNBQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQzlDO0FBRUEsU0FBTyxJQUFJO0FBQ2I7IiwKICAibmFtZXMiOiBbXQp9Cg==
