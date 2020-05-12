import type { App, SayFn, SlashCommand, RespondFn } from '@slack/bolt';
import { sclapeProductInfo } from '../sclapers';
import { upsertProduct, addSubscriber, getSubscribedProducts } from '../store';
import { renderProductListBlockTemplate } from '../views/productList';

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

  const productResult = await sclapeProductInfo(productId);
  if (productResult.isNone) {
    respond({
      text:
        ':warning: 予期しないエラーが発生しました。正しい商品URLか商品IDを指定して、もう一度チャレンジしてみてください。',
      response_type: 'ephemeral',
    });
    return;
  }
  const product = productResult.unwrap();

  await upsertProduct(product);
  await addSubscriber(product.id, command.user_id);

  say(`:sound: <@${command.user_id}>が「${product.name}」を登録をしました。`);
};

const handleListingCommand = async ({
  command,
  respond,
}: CommandHandlerArgs) => {
  await respond({ text: 'リストを取得中です…', response_type: 'ephemeral' });
  const products = await getSubscribedProducts(command.user_id);
  respond({
    text: '登録済みの宅麺はこちら',
    blocks: renderProductListBlockTemplate(products),
    response_type: 'ephemeral',
  });
};

export const useTakumenCommand = (app: App) => {
  app.command('/takumen', async ({ command, ack, say, respond }) => {
    await ack();

    if (command.text.startsWith('add ')) {
      await handleAddCommand({ command, say, respond });
    } else if (command.text.startsWith('list')) {
      await handleListingCommand({ command, say, respond });
    }
  });
};
