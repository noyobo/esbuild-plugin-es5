import { PartialMessage } from 'esbuild';

export const convertError = (error: any): PartialMessage => {
  return {
    pluginName: 'esbuild-plugin-es5',
    text: error.message,
  };
};
