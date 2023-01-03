import { Plugin } from 'vite';

interface PreloadOptions {
    includeJs: boolean;
    includeCss: boolean;
    isPrefetch: boolean;
    prettierSettings: any;
    baseUrl: string;
}

declare function VitePluginPreloadAll(options?: Partial<PreloadOptions>): Plugin;

export { VitePluginPreloadAll as default };
