import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../../store/store';
import testData from '../../../../.storybook/test-data';
import { CHAIN_IDS } from '../../../../shared/constants/network';
import { ImportTokensPopover } from './import-tokens-popover';

const createStore = (chainId = CHAIN_IDS.MAINNET, useTokenDetection = true) => {
  return configureStore({
    ...testData,
    metamask: {
      ...testData.metamask,
      useTokenDetection,
      providerConfig: { chainId },
    },
  });
};

export default {
  title: 'Components/Multichain/ImportTokensPopover',
  component: ImportTokensPopover,
  argTypes: {
    onClose: {
      action: 'onClose',
    },
  },
};

export const DefaultStory = (args) => <ImportTokensPopover {...args} />;
DefaultStory.decorators = [
  (Story) => (
    <Provider store={createStore()}>
      <Story />
    </Provider>
  ),
];

DefaultStory.storyName = 'Default';

export const CustomImportOnlyStory = (args) => (
  <ImportTokensPopover {...args} />
);
CustomImportOnlyStory.decorators = [
  (Story) => (
    <Provider store={createStore(CHAIN_IDS.GOERLI)}>
      <Story />
    </Provider>
  ),
];

CustomImportOnlyStory.storyName = 'Custom Import Only';

export const TokenDetectionDisabledStory = (args) => (
  <ImportTokensPopover {...args} />
);
TokenDetectionDisabledStory.decorators = [
  (Story) => (
    <Provider store={createStore(CHAIN_IDS.MAINNET, false)}>
      <Story />
    </Provider>
  ),
];

TokenDetectionDisabledStory.storyName = 'Token Detection Disabled';
