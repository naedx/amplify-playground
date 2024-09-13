import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_iam_guest_auth/api/amplify/documents.graphql.dart';
import 'package:amplify_iam_guest_auth/data/models/app_models.dart';
import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:uuid/uuid.dart';

class CreatePostComponent extends StatefulHookConsumerWidget {
  const CreatePostComponent({super.key});

  @override
  ConsumerState<CreatePostComponent> createState() =>
      CreatePostComponentState();
}

class CreatePostComponentState extends ConsumerState<CreatePostComponent> {
  final _formKey = GlobalKey<FormState>();

  bool _networkRequestInProgress = false;
  bool _formSubmitted = false;
  bool? _createPostConfirmed;

  final String _formId = const Uuid().v4();
  late final _nameController = TextEditingController(text: "John Doe");
  late final _emailController =
      TextEditingController(text: "johndoe12832103213@testdomain.com");
  late final _phoneController = TextEditingController(text: "123456789");
  late final _subjectController = TextEditingController(text: "A subject");
  late final _messageController =
      TextEditingController(text: "Lorem ipsum dolor sit amet");

  Future<Mutation$CreatePost?> submitValues(CreatePostInput input,
      MutationHookResult<Mutation$CreatePost> createPostMutation) async {
    // use GraphQL Client::
    // final createReportResult = await createPostMutation
    //     .runMutation({'input': input.toJson()}).networkResult;

    // safePrint(createReportResult);

    // if (createReportResult?.hasException == false) {
    //   return createReportResult?.parsedData;
    // } else {
    //   throw Exception(createReportResult?.exception);
    // }

    // use Amplify Client::
    final GraphQLRequest<Model> request = GraphQLRequest<Model>(
        document:
            "mutation CreatePost(\$input: CreatePostInput!) {\n  createPost(input: \$input) {\n    id\n    __typename\n  }\n  __typename\n}",
        variables: {"input": input},
        authorizationMode: APIAuthorizationType.iam);

    final response = await Amplify.API.mutate(request: request).response;

    safePrint(response.data.toString());
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _subjectController.dispose();
    _messageController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final MutationHookResult<Mutation$CreatePost> createPostMutation =
        useMutation<Mutation$CreatePost>(
      MutationOptions(
        document: documentNodeMutationCreatePost,
        parserFn: Mutation$CreatePost.fromJson,
      ),
    );

    validatorNotEmpty(String message) =>
        (value) => value != null && value.isEmpty ? message : null;

    validatorEmail(String message) => (value) =>
        value != null && EmailValidator.validate(value) ? null : message;

    return _formSubmitted == true
        ? ConstrainedBox(
            constraints: const BoxConstraints(minWidth: 200, minHeight: 200),
            child: const Text('Thank you for your message'),
          )
        : Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  key: const Key('nameField'),
                  controller: _nameController,
                  validator: validatorNotEmpty('Please enter your name'),
                  decoration: const InputDecoration(
                    hintText: 'Name',
                  ),
                ),
                TextFormField(
                  key: const Key('emailField'),
                  controller: _emailController,
                  validator: validatorEmail('Please enter your email address'),
                  decoration: const InputDecoration(
                    hintText: 'Email',
                  ),
                ),
                TextFormField(
                  key: const Key('phoneField'),
                  controller: _phoneController,
                  decoration: const InputDecoration(
                    hintText: 'Phone',
                  ),
                ),
                TextFormField(
                  key: const Key('messageField'),
                  controller: _messageController,
                  validator: validatorNotEmpty('Please enter your message'),
                  decoration: const InputDecoration(
                    hintText: 'Message',
                  ),
                  minLines: 5,
                  maxLines: null,
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  key: const Key('submitButton'),
                  onPressed: _networkRequestInProgress == true
                      ? null
                      : () async {
                          if (_networkRequestInProgress == true) {
                            safePrint('Network request already in progress');
                            return;
                          }
                          _networkRequestInProgress = true;

                          if (_formKey.currentState!.validate()) {
                            try {
                              await _confirmCreatePostDialog();

                              if (_createPostConfirmed == true) {
                                final result = await submitValues(
                                  CreatePostInput(
                                    formId: _formId,
                                    name: _nameController.text,
                                    message: _messageController.text,
                                    subject: _subjectController.text,
                                  ),
                                  createPostMutation,
                                );

                                if (context.mounted &&
                                    result?.createPost?.id != null) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text(
                                          'Your post has been successfully created! '),
                                    ),
                                  );

                                  _formSubmitted = true;
                                }
                              }

                              _createPostConfirmed = null;

                              _networkRequestInProgress = false;
                            } catch (e) {
                              if (context.mounted) {
                                debugPrint(e.toString());

                                ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                        content: Text(
                                            'Sorry, your post could not be created')));
                              }

                              _networkRequestInProgress = false;
                            }
                          } else {
                            _networkRequestInProgress = false;
                          }
                        },
                  child: const Text('Submit'),
                )
              ],
            ));
  }

  Future<void> _confirmCreatePostDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Confirm'),
          content: const SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Are you sure that you want to create this post?'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Create'),
              onPressed: () {
                _createPostConfirmed = true;
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                _createPostConfirmed = false;
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
