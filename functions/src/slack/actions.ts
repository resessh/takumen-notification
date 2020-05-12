import type { App, ButtonAction } from '@slack/bolt';
import { removeSubscriber } from '../store';
import { ActionTypes } from '../types';

export const useTakumenAction = (app: App) => {
  app.action(
    ActionTypes.REMOVE_SUBSCRIPTION,
    async ({ ack, payload, body, say }) => {
      await ack();

      const removedProduct = await removeSubscriber(
        (payload as ButtonAction).value,
        body.user.id
      );
      say({
        text: `:mute: <@${body.user.id}>が「${removedProduct.name}」の登録を解除しました。`,
      });
    }
  );
};
