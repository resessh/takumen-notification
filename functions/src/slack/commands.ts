import type { App, SayFn, SlashCommand, RespondFn } from '@slack/bolt';

// const handleListing = async (say: SayFn) => {};

type CommandHandlerArgs = {
  say: SayFn;
  respond: RespondFn;
  command: SlashCommand;
};

const getProductId = (urlOrId: string): string | undefined => {
  if (/^\d+$/.test(urlOrId)) {
    // product id
    return urlOrId;
  }
  if (/^http.+\/\d+$/.test(urlOrId)) {
    // product url
    return /^http.+\/(\d+)$/.exec(urlOrId)?.[1];
  }
};

const handleAddCommand = async ({
  command,
  say,
  respond,
}: CommandHandlerArgs) => {
  const arg = command.text.split(' ')[1];
  const productId = getProductId(arg);
  if (!productId) {
    respond({
      text: ':warning: 正しい商品URLか商品IDを指定してください。',
      response_type: 'ephemeral',
    });
    return;
  }
  say(`:inbox_tray: <@${command.user_id}>が${productId}を登録しました`);
};

export const useTakumenCommand = (app: App) => {
  app.command('/takumen', async ({ command, ack, say, respond }) => {
    await ack();

    if (command.text.startsWith('add ')) {
      await handleAddCommand({ command, say, respond });
    }
  });
};
