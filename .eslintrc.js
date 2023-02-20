module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest', 'prettier'],
  extends: ['airbnb', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    camelcase: [
      'error',
      {
        allow: [
          'product_id',
          'default_price',
          'created_at',
          'updated_at',
          'question_id',
          'answer_id',
          'thumbnail_url',
          'current_pid',
          'original_price',
          'style_id',
          'sale_price',
        ],
      },
    ],
  },
};
