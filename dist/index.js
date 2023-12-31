"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => VitePluginPreloadAll
});
module.exports = __toCommonJS(src_exports);

// src/options.ts
var defaultOptions = {
  includeJs: true,
  includeCss: true,
  isPrefetch: false,
  prettierSettings: null,
  baseUrl: ""
};

// src/index.ts
var import_pluginutils = require("@rollup/pluginutils");

// src/dom-utils.ts
var import_jsdom = require("jsdom");
var createDom = (source) => new import_jsdom.JSDOM(source);
var createModulePreloadLinkElement = (dom, path) => {
  const link = dom.window.document.createElement("link");
  link.rel = "modulepreload";
  link.href = path;
  return link;
};
var createPrefetchLinkElement = (dom, path) => {
  const link = dom.window.document.createElement("link");
  link.rel = "prefetch";
  link.href = path;
  link.setAttribute("as", "script");
  return link;
};
var createStylesheetLinkElement = (dom, path) => {
  const link = dom.window.document.createElement("link");
  link.rel = "stylesheet";
  link.href = path;
  return link;
};
var getExistingLinks = (dom) => {
  const existingLinks = [];
  dom.window.document.querySelectorAll("script").forEach((s) => {
    if (!s.src) {
      return;
    }
    existingLinks.push(s.src);
  });
  dom.window.document.querySelectorAll("link").forEach((l) => existingLinks.push(l.href));
  return existingLinks;
};
var appendToDom = (dom, link) => dom.window.document.head.appendChild(link);

// src/index.ts
var import_prettier = __toESM(require("prettier"));
var jsFilter = (0, import_pluginutils.createFilter)(["**/*-*.js"]);
var cssFilter = (0, import_pluginutils.createFilter)(["**/*-*.css"]);
function VitePluginPreloadAll(options) {
  let viteConfig;
  const mergedOptions = { ...defaultOptions, ...options };
  return {
    name: "vite:vite-plugin-preload",
    enforce: "post",
    apply: "build",
    configResolved(config) {
      viteConfig = config;
    },
    transformIndexHtml: {
      enforce: "post",
      transform: (html, ctx) => {
        if (!ctx.bundle) {
          return html;
        }
        const base = viteConfig.base ?? "";
        const dom = createDom(html);
        const existingLinks = getExistingLinks(dom);
        let additionalModules = [];
        let additionalStylesheets = [];
        for (const bundle of Object.values(ctx.bundle)) {
          let path = `${viteConfig.server.base ?? ""}/${bundle.fileName}`;
          if (mergedOptions.baseUrl) {
            path = `${mergedOptions.baseUrl}/${bundle.fileName}`;
          }
          if (existingLinks.includes(path)) {
            continue;
          }
          if (mergedOptions.includeJs && bundle.type === "chunk" && jsFilter(bundle.fileName)) {
            additionalModules.push(path);
          }
          if (mergedOptions.includeCss && bundle.type === "asset" && cssFilter(bundle.fileName)) {
            additionalStylesheets.push(path);
          }
        }
        additionalModules = additionalModules.sort(
          (a, z) => a.localeCompare(z)
        );
        additionalStylesheets = additionalStylesheets.sort(
          (a, z) => a.localeCompare(z)
        );
        for (const additionalModule of additionalModules) {
          if (mergedOptions.isPrefetch) {
            const element = createPrefetchLinkElement(dom, additionalModule);
            appendToDom(dom, element);
          } else {
            const element = createModulePreloadLinkElement(dom, additionalModule);
            appendToDom(dom, element);
          }
        }
        for (const additionalStylesheet of additionalStylesheets) {
          const element = createStylesheetLinkElement(
            dom,
            additionalStylesheet
          );
          appendToDom(dom, element);
        }
        let prettierSettings = {};
        if (mergedOptions.prettierSettings) {
          prettierSettings = mergedOptions.prettierSettings;
        }
        return import_prettier.default.format(dom.serialize(), { parser: "html", ...prettierSettings });
      }
    }
  };
}
