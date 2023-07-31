/**
 * @jest-environment node
 */
import { ControllerMessenger } from '@metamask/base-controller';
import { TokenListController } from '@metamask/assets-controllers';
import { CHAIN_IDS } from '../../../shared/constants/network';
import PreferencesController from './preferences';

const NETWORK_CONFIGURATION_DATA = {
  'test-networkConfigurationId-1': {
    rpcUrl: 'https://testrpc.com',
    chainId: CHAIN_IDS.GOERLI,
    nickname: '0X5',
    rpcPrefs: { blockExplorerUrl: 'https://etherscan.io' },
  },
  'test-networkConfigurationId-2': {
    rpcUrl: 'http://localhost:8545',
    chainId: '0x539',
    ticker: 'ETH',
    nickname: 'Localhost 8545',
    rpcPrefs: {},
  },
};
describe('preferences controller', () => {
  let preferencesController;
  let tokenListController;

  beforeEach(() => {
    const tokenListMessenger = new ControllerMessenger().getRestricted({
      name: 'TokenListController',
    });
    tokenListController = new TokenListController({
      chainId: '1',
      preventPollingOnNetworkRestart: false,
      onNetworkStateChange: jest.fn(),
      onPreferencesStateChange: jest.fn(),
      messenger: tokenListMessenger,
    });

    preferencesController = new PreferencesController({
      initLangCode: 'en_US',
      tokenListController,
      onInfuraIsBlocked: jest.fn(),
      onInfuraIsUnblocked: jest.fn(),
      networkConfigurations: NETWORK_CONFIGURATION_DATA,
    });
  });

  describe('useBlockie', () => {
    it('defaults useBlockie to false', () => {
      expect(preferencesController.store.getState().useBlockie).toEqual(false);
    });

    it('setUseBlockie to true', () => {
      preferencesController.setUseBlockie(true);
      expect(preferencesController.store.getState().useBlockie).toEqual(true);
    });
  });

  describe('setCurrentLocale', () => {
    it('checks the default currentLocale', () => {
      const { currentLocale } = preferencesController.store.getState();
      expect(currentLocale).toEqual('en_US');
    });

    it('sets current locale in preferences controller', () => {
      preferencesController.setCurrentLocale('ja');
      const { currentLocale } = preferencesController.store.getState();
      expect(currentLocale).toEqual('ja');
    });
  });

  describe('setAddresses', () => {
    it('should keep a map of addresses to names and addresses in the store', () => {
      preferencesController.setAddresses(['0xda22le', '0x7e57e2']);

      const { identities } = preferencesController.store.getState();
      expect(identities).toStrictEqual({
        '0xda22le': {
          name: 'Account 1',
          address: '0xda22le',
        },
        '0x7e57e2': {
          name: 'Account 2',
          address: '0x7e57e2',
        },
      });
    });

    it('should replace its list of addresses', () => {
      preferencesController.setAddresses(['0xda22le', '0x7e57e2']);
      preferencesController.setAddresses(['0xda22le77', '0x7e57e277']);

      const { identities } = preferencesController.store.getState();
      expect(identities).toStrictEqual({
        '0xda22le77': {
          name: 'Account 1',
          address: '0xda22le77',
        },
        '0x7e57e277': {
          name: 'Account 2',
          address: '0x7e57e277',
        },
      });
    });
  });

  describe('removeAddress', () => {
    it('should remove an address from state', () => {
      preferencesController.setAddresses(['0xda22le', '0x7e57e2']);

      preferencesController.removeAddress('0xda22le');

      expect(
        preferencesController.store.getState().identities['0xda22le'],
      ).toEqual(undefined);
    });

    it('should switch accounts if the selected address is removed', () => {
      preferencesController.setAddresses(['0xda22le', '0x7e57e2']);

      preferencesController.setSelectedAddress('0x7e57e2');
      preferencesController.removeAddress('0x7e57e2');
      expect(preferencesController.getSelectedAddress()).toEqual('0xda22le');
    });
  });

  describe('setAccountLabel', () => {
    it('should update a label for the given account', () => {
      preferencesController.setAddresses(['0xda22le', '0x7e57e2']);

      expect(
        preferencesController.store.getState().identities['0xda22le'],
      ).toStrictEqual({
        name: 'Account 1',
        address: '0xda22le',
      });

      preferencesController.setAccountLabel('0xda22le', 'Dazzle');
      expect(
        preferencesController.store.getState().identities['0xda22le'],
      ).toStrictEqual({
        name: 'Dazzle',
        address: '0xda22le',
      });
    });
  });

  describe('setPasswordForgotten', () => {
    it('should default to false', () => {
      expect(preferencesController.store.getState().forgottenPassword).toEqual(
        false,
      );
    });

    it('should set the forgottenPassword property in state', () => {
      preferencesController.setPasswordForgotten(true);
      expect(preferencesController.store.getState().forgottenPassword).toEqual(
        true,
      );
    });
  });

  describe('setUsePhishDetect', () => {
    it('should default to true', () => {
      expect(preferencesController.store.getState().usePhishDetect).toEqual(
        true,
      );
    });

    it('should set the usePhishDetect property in state', () => {
      preferencesController.setUsePhishDetect(false);
      expect(preferencesController.store.getState().usePhishDetect).toEqual(
        false,
      );
    });
  });

  describe('setUseMultiAccountBalanceChecker', () => {
    it('should default to true', () => {
      expect(
        preferencesController.store.getState().useMultiAccountBalanceChecker,
      ).toEqual(true);
    });

    it('should set the setUseMultiAccountBalanceChecker property in state', () => {
      preferencesController.setUseMultiAccountBalanceChecker(false);
      expect(
        preferencesController.store.getState().useMultiAccountBalanceChecker,
      ).toEqual(false);
    });
  });

  describe('setUseTokenDetection', () => {
    it('should default to false', () => {
      expect(preferencesController.store.getState().useTokenDetection).toEqual(
        false,
      );
    });

    it('should set the useTokenDetection property in state', () => {
      preferencesController.setUseTokenDetection(true);
      expect(preferencesController.store.getState().useTokenDetection).toEqual(
        true,
      );
    });
  });

  describe('setUseNftDetection', () => {
    it('should default to false', () => {
      expect(preferencesController.store.getState().useNftDetection).toEqual(
        false,
      );
    });

    it('should set the useNftDetection property in state', () => {
      preferencesController.setOpenSeaEnabled(true);
      preferencesController.setUseNftDetection(true);
      expect(preferencesController.store.getState().useNftDetection).toEqual(
        true,
      );
    });
  });

  describe('setOpenSeaEnabled', () => {
    it('should default to false', () => {
      expect(preferencesController.store.getState().openSeaEnabled).toEqual(
        false,
      );
    });

    it('should set the openSeaEnabled property in state', () => {
      preferencesController.setOpenSeaEnabled(true);
      expect(preferencesController.store.getState().openSeaEnabled).toEqual(
        true,
      );
    });
  });

  describe('setAdvancedGasFee', () => {
    it('should default to null', () => {
      expect(preferencesController.store.getState().advancedGasFee).toEqual(
        null,
      );
    });

    it('should set the setAdvancedGasFee property in state', () => {
      preferencesController.setAdvancedGasFee({
        maxBaseFee: '1.5',
        priorityFee: '2',
      });
      expect(
        preferencesController.store.getState().advancedGasFee.maxBaseFee,
      ).toEqual('1.5');
      expect(
        preferencesController.store.getState().advancedGasFee.priorityFee,
      ).toEqual('2');
    });
  });

  describe('setTheme', () => {
    it('should default to value "OS"', () => {
      expect(preferencesController.store.getState().theme).toEqual('os');
    });

    it('should set the setTheme property in state', () => {
      preferencesController.setTheme('dark');
      expect(preferencesController.store.getState().theme).toEqual('dark');
    });
  });

  describe('setUseCurrencyRateCheck', () => {
    it('should default to false', () => {
      expect(
        preferencesController.store.getState().useCurrencyRateCheck,
      ).toEqual(true);
    });

    it('should set the useCurrencyRateCheck property in state', () => {
      preferencesController.setUseCurrencyRateCheck(false);
      expect(
        preferencesController.store.getState().useCurrencyRateCheck,
      ).toEqual(false);
    });
  });

  describe('setIncomingTransactionsPreferences', () => {
    const addedNonTestNetworks = Object.keys(NETWORK_CONFIGURATION_DATA);

    it('should have default value combined', () => {
      const state = preferencesController.store.getState();
      expect(state.incomingTransactionsPreferences).toStrictEqual({
        [CHAIN_IDS.MAINNET]: true,
        [CHAIN_IDS.LINEA_MAINNET]: true,
        [NETWORK_CONFIGURATION_DATA[addedNonTestNetworks[0]].chainId]: true,
        [NETWORK_CONFIGURATION_DATA[addedNonTestNetworks[1]].chainId]: true,
        [CHAIN_IDS.GOERLI]: true,
        [CHAIN_IDS.SEPOLIA]: true,
        [CHAIN_IDS.LINEA_GOERLI]: true,
      });
    });

    it('should update incomingTransactionsPreferences with givin value set', () => {
      preferencesController.setIncomingTransactionsPreferences(
        CHAIN_IDS.LINEA_MAINNET,
        false,
      );
      const state = preferencesController.store.getState();
      expect(state.incomingTransactionsPreferences).toStrictEqual({
        [CHAIN_IDS.MAINNET]: true,
        [CHAIN_IDS.LINEA_MAINNET]: false,
        [NETWORK_CONFIGURATION_DATA[addedNonTestNetworks[0]].chainId]: true,
        [NETWORK_CONFIGURATION_DATA[addedNonTestNetworks[1]].chainId]: true,
        [CHAIN_IDS.GOERLI]: true,
        [CHAIN_IDS.SEPOLIA]: true,
        [CHAIN_IDS.LINEA_GOERLI]: true,
      });
    });
  });
});
