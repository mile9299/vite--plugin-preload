export interface PreloadOptions {
  includeJs: boolean;
  includeCss: boolean;
  isPrefetch: boolean;
  prettierSettings: any;
}

export const defaultOptions: PreloadOptions = {
  includeJs: true,
  includeCss: true,
  isPrefetch: false,
  prettierSettings: null,
};
