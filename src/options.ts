export interface PreloadOptions {
  includeJs: boolean;
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
