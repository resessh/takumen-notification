import { db } from './firebase';
import { Product, SlackId } from './types';

const createProduct = async (product: Product) => {
  await db.collection('products').doc(product.id).set({
    name: product.name,
    thumbnail: product.thumbnail,
    hasStock: product.hasStock,
    subscribers: [],
  });
};

const updateProduct = async (product: Product) => {
  await db.collection('products').doc(product.id).update({
    name: product.name,
    thumbnail: product.thumbnail,
    hasStock: product.hasStock,
  });
};

const getIsProductExists = async (product: Product) =>
  (await db.collection('products').doc(product.id).get()).exists;

export const upsertProduct = async (product: Product) => {
  if (await getIsProductExists(product)) {
    updateProduct(product);
    return;
  }
  createProduct(product);
};

export const addSubscriber = async (
  productId: Product['id'],
  slackId: SlackId
) => {
  const productRef = await db.collection('products').doc(productId);

  const existsSubscribers: string[] =
    (await productRef.get()).data()?.subscribers ?? [];
  const newSubscribers = Array.from(new Set(existsSubscribers).add(slackId));

  await productRef.update({
    subscribers: newSubscribers,
  });
};

export const removeSubscriber = async (
  productId: Product['id'],
  slackId: SlackId
): Promise<Product> => {
  const productRef = await db.collection('products').doc(productId);
  const product = (await productRef.get()).data();

  const existsSubscribers: string[] = product?.subscribers ?? [];
  const newSubscribers = existsSubscribers.filter((item) => item !== slackId);

  if (newSubscribers.length === 0) {
    await productRef.delete();
  } else {
    await productRef.update({
      subscribers: newSubscribers,
    });
  }
  return { id: productId, ...product } as Product;
};

export const getSubscribers = async (productId: Product['id']) => {
  return (
    await db
      .collection('products')
      .doc(productId)
      .collection('subscribers')
      .listDocuments()
  ).map((ref) => ref.id);
};

export const getSubscribedProducts = async (
  slackId: SlackId
): Promise<Product[]> => {
  return await db
    .collectionGroup('products')
    .where('subscribers', 'array-contains', slackId)
    .get()
    .then((querySnapshot) => {
      const list: Product[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Product);
      });
      return list;
    });
};
