import type { ProductWithSubscribers } from '../types';
import type { SayArguments } from '@slack/bolt';

export const renderNotificationTemplate = (
  product: ProductWithSubscribers
): SayArguments => {
  const url = `https://www.takumen.com/products/${product.id}`;
  const mention = product.subscribers
    .map((slackId) => `<@${slackId}>`)
    .join(' ');

  return {
    text: `:loudspeaker: *${product.name}* の在庫が復活しました`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:loudspeaker: *<${url}|${product.name}>* の在庫が復活しました\n${mention}`,
        },
        accessory: {
          type: 'image',
          image_url: product.thumbnail,
          alt_text: product.name,
        },
      },
    ],
  };
};
