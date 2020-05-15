import type { App, SayFn, SlashCommand, RespondFn } from '@slack/bolt';
import { sclapeProductInfo } from '../sclapers';
import { upsertProduct, addSubscriber, getSubscribedProducts } from '../store';
import { renderProductListBlockTemplate } from '../views/productList';

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
  console.warn('😂 1. before exec', new Date().toISOString());
  const arg = command.text.split(' ')[1];
  const productId = getProductId(arg);
  if (!productId) {
    respond({
      text: ':warning: 正しい商品URLか商品IDを指定してください。',
      response_type: 'ephemeral',
    });
    return;
  }

  console.warn('😂 2. before sclape', new Date().toISOString());
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

  console.warn('😂 3. before upsert store', new Date().toISOString());
  await upsertProduct(product);
  console.warn('😂 4. before upsert subscriber', new Date().toISOString());
  await addSubscriber(product.id, command.user_id);

  console.warn('😂 5. before send message', new Date().toISOString());
  await say(
    `:sound: <@${command.user_id}>が「${product.name}」を登録をしました。`
  );
  console.warn('😂 6. finished', new Date().toISOString());
};

const handleListingCommand = async ({
  command,
  respond,
}: CommandHandlerArgs) => {
  await respond({ text: 'リストを取得中です…', response_type: 'ephemeral' });
  console.warn('😂 1. before get list', new Date().toISOString());
  const products = await getSubscribedProducts(command.user_id);
  console.warn('😂 2. before send message', new Date().toISOString());

  await respond({
    text: '登録済みの宅麺はこちら',
    blocks: renderProductListBlockTemplate(products),
    response_type: 'ephemeral',
  });
  console.warn('😂 3. finished', new Date().toISOString());
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
