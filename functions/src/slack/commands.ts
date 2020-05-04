import type { App, SayFn } from '@slack/bolt';

// const handleListing = async (say: SayFn) => {};

const handleAddCommand = async (say: SayFn) => {};

export const useTakumenCommand = (app: App) => {
  app.command('/takumen', async ({ command, ack, say }) => {
    await ack();

    if (command.text.startsWith('add ')) {
    }
    await say(`You said "${command.text}"`);
  });
};
