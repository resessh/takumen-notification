import { ActionTypes } from '../types';
import type { SayArguments } from '@slack/bolt';
import type { SectionBlock, DividerBlock } from '@slack/types';
import type { Product } from '../types';

export const renderProductListBlockTemplate = (
  products: Product[]
): SayArguments['blocks'] => {
  const productBlockItems: SectionBlock[][] = products.map((product) => [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${product.name}*`,
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: '登録を外す',
          emoji: true,
        },
        style: 'danger',
        action_id: ActionTypes.REMOVE_SUBSCRIPTION,
        value: `${product.id}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<https://www.takumen.com/products/${product.id}>\n${
          product.hasStock ? ':o: 在庫あり' : ':x: 在庫なし'
        }`,
      },
      accessory: {
        type: 'image',
        image_url: product.thumbnail,
        alt_text: product.name,
      },
    },
  ]);

  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '登録済みの宅麺はこちら',
      },
    },
    ...productBlockItems.reduce<(SectionBlock | DividerBlock)[]>(
      (acc, item, index) => {
        return [...acc, { type: 'divider' } as DividerBlock, ...item];
      },
      []
    ),
    { type: 'divider' },
  ];
};
