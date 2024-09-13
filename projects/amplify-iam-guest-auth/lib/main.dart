import 'dart:convert';

import 'package:amplify_api/amplify_api.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_iam_guest_auth/amplifyconfiguration.dart';
import 'package:amplify_iam_guest_auth/common/aws_auth_helpers.dart';
import 'package:amplify_iam_guest_auth/components/create_post_component.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final config = jsonDecode(amplifyConfig);

void main() async {
  try {
    WidgetsFlutterBinding.ensureInitialized();

    await _configureAmplify();

    final gqlApiEndpoint =
        config["api"]["plugins"]["awsAPIPlugin"]["data"]["endpoint"];

    final gqlApiRegion =
        config["api"]["plugins"]["awsAPIPlugin"]["data"]["region"];

    final link = Link.from([
      AuthLink(getToken: getLatestAuthToken),
      SignIAMRequestLink(
        gqlApiRegion: gqlApiRegion,
        gqlApiEndpoint: gqlApiEndpoint,
      ),
      DedupeLink(),
      HttpLink(gqlApiEndpoint),
    ]);

    ValueNotifier<GraphQLClient> client = ValueNotifier(
      GraphQLClient(
        link: link,
        // The default store is the InMemoryStore, which does NOT persist to disk
        cache: GraphQLCache(store: InMemoryStore()),
      ),
    );

    runApp(ProviderScope(
        child: GraphQLProvider(
      client: client,
      child: const MyApp(),
    )));
  } on AmplifyException catch (e) {
    runApp(
        ProviderScope(child: Text("Error configuring Amplify: ${e.message}")));
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter+ Amplify IAM Auth Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 40, maxWidth: 300),
              child: CreatePostComponent(),
            )
          ],
        ),
      ),
    );
  }
}

Future<void> _configureAmplify() async {
  try {
    // Add any Amplify plugins you want to use
    final authPlugin = AmplifyAuthCognito();
    final api = AmplifyAPI(
        // options: APIPluginOptions(modelProvider: ModelProvider.instance)
        );

    await Amplify.addPlugins([authPlugin, api]);

    await Amplify.configure(amplifyConfig);
    safePrint('Successfully configured');
  } on Exception catch (e) {
    safePrint('Error configuring Amplify: $e');
  }
}

Future<String?> getLatestAuthToken() async {
  // Returns the value to be set as the 'Authorization' header for the GraphQL request

  final session = await Amplify.Auth.fetchAuthSession() as CognitoAuthSession;

  final tokens = session.userPoolTokensResult.valueOrNull;

  if (tokens != null) {
    // This token works as expected
    return tokens.idToken.raw;
  } else {
    return null;
  }
}
