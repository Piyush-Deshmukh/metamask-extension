import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../../store/store';
import testData from '../../../../.storybook/test-data';
import { CHAIN_IDS } from '../../../../shared/constants/network';
import { ImportTokensPopover } from './import-tokens-popover';

const store = configureStore({
  ...testData,
  metamask: {
    ...testData.metamask,
    useTokenDetection: true,
    providerConfig: {
      chainId: CHAIN_IDS.MAINNET,
    },
  },
});

export default {
  title: 'Components/Multichain/ImportTokensPopover',
  component: ImportTokensPopover,
  argTypes: {
    onClose: {
      action: 'onClose',
    },
  },
  args: {
    closeMenu: () => console.log('Closing popover!'),
  },
};

export const DefaultStory = (args) => <ImportTokensPopover {...args} />;
DefaultStory.decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
];

DefaultStory.storyName = 'Default';
