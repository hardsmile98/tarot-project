module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
