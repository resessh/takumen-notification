import { db } from './firebase';
import { Product, SlackId } from './types';

export const updateProduct = async (product: Product) => {
  await db.collection('products').doc(product.id).set({
    name: product.name,
    thumbnail: product.thumbnail,
    hasStock: product.hasStock,
  });
};

export const addSubscriber = async (
  productId: Product['id'],
  slackId: SlackId
) => {
  await db
    .collection('products')
    .doc(productId)
    .collection('subscribers')
    .doc(slackId)
    .set({});
};

