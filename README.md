# takumen-notification
宅麺

## Setup
1. create `.firebaserc` and fill project name.
2. add firebase function configs
  ```sh
  $ firebase function config:set \
    functions.region="<CHOOSE_WHAT_YOU_LIKE>" \
    slack.bot_token="<GET_FROM_SLACK_BOT_ADMIN>"
    slack.signing_secret="<GET_FROM_SLACK_BOT_ADMIN>" \
    slack.webhook="<GET_FROM_SLACK_APP_CONFIG>"
  ```
3. deploy
  ```sh
  $ yarn
  $ yarn deploy
  ```

## License
MIT
