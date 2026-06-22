import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e6gakxlb';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN || 'skICX2YLTL7pEGWpwheZoN0mxFJFMGQHU71KCF1jeQp9uAWVLwl9HY0N4Ocb3nmUB9Wvlm6awghZTqGME97AywclW4X98fCoyvpcoxqUOjpxfTxPRA2JODLE5Pky1Y5WeyF7pxk9SWjiMDUDIxnuTqlklysvrVVEyA0bkEI67tskAnG7WGRN';

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2026-06-21',
  token,
});
