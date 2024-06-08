module.exports = {
  extends: ['@mate-academy/eslint-config-react-typescript'],
  rules: {
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: [
      "./tsconfig.json",
      "./public/API/tsconfig.server.json",
      "./tsconfig.models.json"
    ],
  },
  ignorePatterns: ['tailwind.config.js', 'postcss.config.js', '.eslintrc.js'],
};

