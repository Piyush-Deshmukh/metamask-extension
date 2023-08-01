import { cloneDeep } from 'lodash';
import { hasProperty, isObject } from '@metamask/utils';
import { NetworkStatus } from '@metamask/network-controller';

export const version = 92;

/**
 * Migrate NetworkDetails & NetworkStatus state on the NetworkConroller to NetworksMetadata
 *
 * @param originalVersionedData - Versioned MetaMask extension state, exactly what we persist to dist.
 * @param originalVersionedData.meta - State metadata.
 * @param originalVersionedData.meta.version - The current state version.
 * @param originalVersionedData.data - The persisted MetaMask state, keyed by controller.
 * @returns Updated versioned MetaMask extension state.
 */
export async function migrate(originalVersionedData: {
  meta: { version: number };
  data: Record<string, unknown>;
}) {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  versionedData.data = transformState(versionedData.data);
  return versionedData;
}

function transformState(state: Record<string, unknown>) {
  if (
    hasProperty(state, 'NetworkController') &&
    isObject(state.NetworkController) &&
    hasProperty(state.NetworkController, 'providerConfig') &&
    isObject(state.NetworkController.providerConfig) &&
    hasProperty(state.NetworkController.providerConfig, 'id') &&
    typeof state.NetworkController.providerConfig.id === 'string'
  ) {
    const networksMetadata = {
      [state.NetworkController.providerConfig.id]: {
        EIPS: {},
        status: NetworkStatus.Unknown,
      },
    };
    if (
      hasProperty(state.NetworkController, 'networkDetails') &&
      isObject(state.NetworkController.networkDetails)
    ) {
      const { networkDetails } = state.NetworkController;

      if (networkDetails.EIPS) {
        networksMetadata[state.NetworkController.providerConfig.id].EIPS =
          networkDetails.EIPS;
      }
      delete state.NetworkController.networkDetails;
    }

    if (
      hasProperty(state.NetworkController, 'networkStatus') &&
      typeof state.NetworkController.networkStatus === 'string'
    ) {
      networksMetadata[state.NetworkController.providerConfig.id].status = state
        .NetworkController.networkStatus as NetworkStatus;
      delete state.NetworkController.networkStatus;
    }

    state.NetworkController.networksMetadata = networksMetadata;

    return {
      ...state,
      NetworkController: state.NetworkController,
    };
  }
  return state;
}
