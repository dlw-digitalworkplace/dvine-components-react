"use strict";

const gulp = require("gulp");
const build = require("@microsoft/sp-build-web");
build.addSuppression(
  `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

/* exclude node_modules from source-map-loader */
build.configureWebpack.mergeConfig({
  additionalConfiguration: generatedConfiguration => {
    const rules = generatedConfiguration.module.rules;
    const sourceMapRuleIndex = rules.findIndex(rule => rule.use.indexOf("source-map-loader") > -1);

    const useValue = rules[sourceMapRuleIndex].use;
    rules[sourceMapRuleIndex].exclude = [
      useValue.slice(0, useValue.indexOf("\\source-map-loader"))
    ];

    return generatedConfiguration;
  }
});

build.initialize(gulp);
