import { Plugin } from 'vite';

interface PreloadOptions {
    /**
     * @default true
     */
    includeJs: boolean;
    /**
     * @default true
     */
    includeCss: boolean;
    isPrefetch: boolean;
    prettierSettings: any;
    baseUrl: string;
}

declare function VitePluginPreloadAll(options?: Partial<PreloadOptions>): Plugin;

export { VitePluginPreloadAll as default };
