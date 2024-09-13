import { AppSyncIdentityCognito, Context, util } from '@aws-appsync/utils';

export const isAppSyncIdentityCognito = (identity: any): identity is AppSyncIdentityCognito => {
  if (identity && identity.sub && identity.username) {
    return true;
  }

  return false;
}

export function getLoggedInUserId(ctx: Context) {

  if (isAppSyncIdentityCognito(ctx.identity)) {
    return ctx.identity.sub;
  }

  util.error('NotCognitoIdentity: Not a cognito identity'); // AppSync_JS does not support throwing Error.
}

export interface ModelMetaData {
  owner?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CreateModelMetaData {
  createdBy: string;
  createdAt: string;
}

export interface UpdateModelMetaData {
  updatedBy: string;
  updatedAt: string;
}

export function validateEnvironmentVariables(...variables: string[]) {
  const missingVariables = variables.filter(variable => !process.env[variable]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }
}