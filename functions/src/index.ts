import functions from 'firebase-functions';
import { App, ExpressReceiver } from '@slack/bolt';
import { useTakumenCommand } from './slack/commands';

const configs = functions.config();
const REGION = configs.functions.region;

const receiver = new ExpressReceiver({
  signingSecret: configs.slack.signing_secret,
  endpoints: '/events',
});

const app = new App({
  receiver,
  signingSecret: configs.slack.signing_secret,
  token: configs.slack.bot_token,
});

app.error(async (error) => console.error(error));

useTakumenCommand(app);

// exports.slack = functions
//   .runWith({
//     timeoutSeconds: 60,
//     memory: '2GB',
//   })
//   .region(REGION)
//   .https.onRequest(receiver.app);
export const slack = functions.region(REGION).https.onRequest(receiver.app);
