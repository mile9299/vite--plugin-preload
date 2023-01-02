// src/options.ts
var defaultOptions = {
  includeJs: true,
  includeCss: true,
  isPrefetch: false
};

// src/index.ts
import { createFilter } from "@rollup/pluginutils";

// src/dom-utils.ts
import { JSDOM } from "jsdom";
var createDom = (source) => new JSDOM(source);
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
import prettier from "prettier";
var jsFilter = createFilter(["**/*.*.js"]);
var cssFilter = createFilter(["**/*.*.css"]);
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
        const dom = createDom(html);
        const existingLinks = getExistingLinks(dom);
        let additionalModules = [];
        let additionalStylesheets = [];
        for (const bundle of Object.values(ctx.bundle)) {
          const path = `${viteConfig.server.base ?? ""}/${bundle.fileName}`;
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
        return prettier.format(dom.serialize(), { parser: "html" });
      }
    }
  };
}
export {
  VitePluginPreloadAll as default
};
