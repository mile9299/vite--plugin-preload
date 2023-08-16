import type { Options as PrettierOptions } from "prettier";

export interface PreloadOptions {
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

export const defaultOptions: PreloadOptions = {
  includeJs: true,
  includeCss: true,
  isPrefetch: false,
  prettierSettings: null,
  baseUrl: '',
};
