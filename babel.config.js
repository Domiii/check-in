module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    "@babel/preset-react"
  ];
  const plugins = [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-function-bind",
    "@babel/plugin-syntax-export-default-from",
    "@babel/plugin-syntax-dynamic-import"
  ];

  return {
    presets,
    plugins
  };
}