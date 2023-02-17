module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: [
    'airbnb',
    'airbnb-base',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/extensions': ['error', { jsx: 'always' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    camelcase: ['error', {
      allow: [
        'product_id',
        'default_price',
        'created_at',
        'updated_at',
        'question_id',
        'answer_id',
        'thumbnail_url',
      ],
    }],
  },
};
