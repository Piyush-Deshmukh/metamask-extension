import { InfuraNetworkType, NetworkType } from '@metamask/controller-utils';
import { NetworkStatus } from '@metamask/network-controller';
import { migrate, version } from './092';

describe('migration #92', () => {
  it('should update the version metadata', async () => {
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: {},
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({
      version,
    });
  });

  it('should return state unaltered if there is no network controller state', async () => {
    const oldData = {
      other: 'data',
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('should return state unaltered if there is no network controller providerConfig state', async () => {
    const oldData = {
      other: 'data',
      NetworkController: {
        networkConfigurations: {
          id1: {
            foo: 'bar',
          },
        },
      },
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('should return state unaltered if there is no providerConfig id state', async () => {
    const oldData = {
      other: 'data',
      NetworkController: {
        providerConfig: {
          ticker: 'ETH',
          type: InfuraNetworkType.goerli,
          chainId: '5',
          nickname: 'Goerli Testnet',
        },
      },
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual(oldData);
  });

  it('should migrate networkStatus into networksMetadata keyed by the active providerConfig.id value, calling the new value "status" and deleting the root networkStatus value', async () => {
    const oldData = {
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
          id: 'test-network-client-id',
        },
        networkStatus: NetworkStatus.Available,
      },
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
        },
        networksMetadata: {
          'test-network-client-id': {
            status: NetworkStatus.Available,
            EIPS: {},
          },
        },
      },
    });
  });

  it('should migrate the contents of networkDetails into networksMetadata keyed by the active providerConfig.id value, and delete the root networkDetails value', async () => {
    const oldData = {
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
          id: 'test-network-client-id',
        },
        networkDetails: {
          EIPS: { 1559: false },
        },
      },
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
        },
        networksMetadata: {
          'test-network-client-id': {
            status: NetworkStatus.Unknown,
            EIPS: {
              1559: false,
            },
          },
        },
      },
    });
  });

  it('should update state migrating networkStatus and networkDetails state into networksMetadata keyed by the active providerConfig.id value', async () => {
    const oldData = {
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
          id: 'test-network-client-id',
        },
        networkStatus: NetworkStatus.Available,
        networkDetails: {
          EIPS: { 1559: false },
        },
      },
    };
    const oldStorage = {
      meta: {
        version: 91,
      },
      data: oldData,
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      other: 'data',
      NetworkController: {
        providerConfig: {
          type: NetworkType.rpc,
          chainId: '0x9292',
          nickname: 'Funky Town Chain',
          ticker: 'ETH',
        },
        networksMetadata: {
          'test-network-client-id': {
            status: NetworkStatus.Available,
            EIPS: { 1559: false },
          },
        },
      },
    });
  });
});
