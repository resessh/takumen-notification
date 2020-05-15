import functions from 'firebase-functions';
import fetch from 'node-fetch';
import { getAllProducts, upsertProduct } from './store';
import { sclapeProductInfo } from './sclapers';
import { renderNotificationTemplate } from './views/notification';

import type { https } from 'firebase-functions';
import type express from 'express';
import type { Product } from './types';

const WEBHOOK_URL = functions.config().slack.webhook;

const checkIsProductStockRecovered = async (
  product: Product
): Promise<boolean> => {
  const hadStock = product.hasStock;

  const productOption = await sclapeProductInfo(product.id);
  if (productOption.isNone) {
    return false;
  }

  const fetchedProduct = productOption.unwrap();
  const { hasStock } = fetchedProduct;

  await upsertProduct(fetchedProduct);
  return !hadStock && hasStock;
};

export const checkProductsHandler = async (
  _: https.Request,
  res: express.Response<void>
): Promise<void> => {
  const products = await getAllProducts();

  await Promise.all(
    products.map(async (product) => {
      const isProductStockRecovered = await checkIsProductStockRecovered(
        product
      );

      if (!isProductStockRecovered) {
        return;
      }

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(renderNotificationTemplate(product)),
      });
    })
  );

  res.status(200).send();
};
