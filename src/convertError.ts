import { PartialMessage } from 'esbuild';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertError = (error: any): PartialMessage => {
  const partialMessage: PartialMessage = {
    pluginName: 'esbuild-plugin-es5',
    text: error.message,
  };

  return partialMessage;
};
