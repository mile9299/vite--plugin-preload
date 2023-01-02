export interface PreloadOptions {
  includeJs: boolean;
  includeCss: boolean;
  isPrefetch: boolean;
}

export const defaultOptions: PreloadOptions = {
  includeJs: true,
  includeCss: true,
  isPrefetch: false,
};
