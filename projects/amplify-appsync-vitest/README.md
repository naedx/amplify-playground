# AWS Amplify + Vitest

In this example we explore using Vitest to test an AWS Amplify/AWS AppSync backend. You can write tests that validate the output of your resolver's request and response templates given some input. This can be done locally by calling on the `request(...)` and `response(...)` functions. You can also choose to test them together in the AWS hosted AppSync runtime.

## Local Only
The `@aws-appsync/utils` library provides types but not implementations for commonly used functions. You must therefore mock the required interfaces. 

```ts 
//...

// mock the required functioins from @aws-appsync/utils
vi.mock('@aws-appsync/utils', () => {

  const originalAppSyncUtils = require('@aws-appsync/utils');
  const { marshall } = require('@aws-sdk/util-dynamodb');
  const { v4 } = require('uuid');

  return {
    ...originalAppSyncUtils,
    util: {
      error: (msg: string | undefined) => { throw new Error(msg) },
      autoId: () => v4(),
      dynamodb: {
        toMapValues: (val: any) => { return marshall(val); }
      },
      time: {
        nowEpochSeconds: () => Math.floor(Date.now() / 1000),
        nowISO8601: () => new Date().toISOString()
      }
    }
  }
});

// use the mocked @aws-appsync/utils in local unit tests
describe('Offline/Local Test: Use mock of @aws-appsync/utils', () => {

  test('A well formed request should create a valid PutRequest', () => {

    const createTodoInput = {
      "content": `Todo ${uuidV4()}`
    };

    const context = createTestContext({ input: createTodoInput });

    const resolvedRequestTemplate = request(context);

    expect(resolvedRequestTemplate?.operation).toBe('PutItem');
    expect(resolvedRequestTemplate?.key?.id.S).toBeTypeOf('string');
    expect((resolvedRequestTemplate?.attributeValues?.content as DynamoDBStringResult).S).toBe(createTodoInput.content);
  });

  test('A well formed request should execute successfully', () => {

    const sendMessageInput = {
      "content": `Todo ${uuidV4()}`
    };

    // Request
    const requestContext = createTestContext(
      { input: sendMessageInput },
    );

    const resolvedRequestTemplate = request(requestContext);

    // Response
    const responseContext = createTestContext(
      { input: sendMessageInput },
      { id: resolvedRequestTemplate.key.id.S }
    );

    const resolvedResponseTemplate = response(responseContext);

    expect(resolvedResponseTemplate.id).toEqual(resolvedRequestTemplate.key.id.S);
  });

});

//...

```
## Online: AWS hosted AppSync runtime
You may also test your resolvers by running them in the AWS AppSync managed runtime. 

```ts
//...

describe('Online/AWS Runtime Resolver Test', async () => {
  const client = new AppSync({ region: 'us-east-1' });
  const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' };
  const __dirname = path.resolve('amplify/data');

  test('Create todo resolver', async () => {
    const createTodoInput = {
      "content": `Test subject ${uuidV4()}`
    };

    const code = fs.readFileSync(__dirname + '/features/todo/todo.create.resolver.js', 'utf8')

    const contextJSON = createTestContextForEvaluate<{ input: typeof createTodoInput }>({ input: createTodoInput });

    const response = await client.evaluateCode({
      code,
      context: JSON.stringify(contextJSON),
      runtime,
      function: 'request'
    }).promise();

    const result = JSON.parse(response.evaluationResult!);

    expect(result?.key?.id?.S).toBeTypeOf('string');
    expect(result?.attributeValues?.content?.S).toEqual(contextJSON.arguments.input.content);
  });
});

//...

```

See the source for the full code.

## Usage

  1. Install dependencies: `npm i`
  2. Run the tests: `npm run test` 