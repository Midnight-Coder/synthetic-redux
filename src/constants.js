export const CATEGORY_NAMES = {
  CRUD: 'CRUD',
  IGNITE: 'IGNITE',
};

export const ERROR_SUFFIX = '_ERROR';

export const SUCCESS_SUFFIX = '_SUCCESS';

export const CATEGORY = {
  [CATEGORY_NAMES.IGNITE]: { args: ['method', 'payload', 'stub', 'url'] },
  [CATEGORY_NAMES.CRUD]: [
    { typeSuffix: ERROR_SUFFIX, args: ['cb', 'payload'] },
    { typeSuffix: SUCCESS_SUFFIX, args: ['cb', 'payload'] },
  ],
};
