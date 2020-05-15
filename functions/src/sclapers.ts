import * as ky from 'ky-universal';
import * as cheerio from 'cheerio';
import { createSome, createNone } from 'option-t/cjs/Option';
import type { Option } from 'option-t/cjs/Option';
import type { Product } from './types';

export const sclapeProductInfo = async (
  productId: string
): Promise<Option<Product>> => {
  try {
    const responseHtml = await ky
      .get(`https://www.takumen.com/products/${productId}`)
      .then((res) => res.text());

    const $ = cheerio.load(responseHtml);

    const name = $('h1.h1Ttl .ttlSpan').text();
    const thumbnailSrc = $('.photo img').attr('src');
    const thumbnail = thumbnailSrc?.startsWith('//')
      ? `https:${thumbnailSrc}`
      : thumbnailSrc;
    const hasStock = !!$('.subTaste img[src="/assets/btn_waiting.jpg"]').html();

    if (!name) {
      // 宅麺には404という概念が無い
      return createNone();
    }

    return createSome({
      id: productId,
      name,
      thumbnail,
      hasStock,
    });
  } catch (error) {
    return createNone();
  }
};
