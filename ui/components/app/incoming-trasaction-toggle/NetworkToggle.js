import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Box, Text } from '../../component-library';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  Color,
  Display,
  FlexDirection,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';

import Tooltip from '../../ui/tooltip';
import {
  CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP,
  CHAIN_IDS,
} from '../../../../shared/constants/network';
import ToggleButton from '../../ui/toggle-button';
import { I18nContext } from '../../../contexts/i18n';
import Identicon from '../../ui/identicon/identicon.container';
import UrlIcon from '../../ui/url-icon';

const MAXIMUM_CHARACTERS_WITHOUT_TOOLTIP = 20;

const NetworkToggle = ({
  networkPreferences,
  toggleSingleNetwork,
  chainId,
}) => {
  const t = useContext(I18nContext);

  const { isShowIncomingTransactions, isATestNetwork } = networkPreferences;

  const networkName = networkPreferences.label;

  return (
    <Box
      marginTop={6}
      marginBottom={6}
      display={Display.Flex}
      flexDirection={FlexDirection.Row}
      justifyContent={JustifyContent.spaceBetween}
      data-testid={`network-toggle-${chainId}`}
    >
      <Box
        gap={2}
        backgroundColor={Color.transparent}
        display={Display.Flex}
        alignItems={AlignItems.center}
        width={BlockSize.Full}
      >
        {chainId in CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP ? (
          <Identicon
            className="networks-tab__content__custom-image"
            diameter={24}
            image={CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP[chainId]}
            imageBorder
          />
        ) : (
          !isATestNetwork && (
            <UrlIcon
              className="networks-tab__content__icon-with-fallback"
              fallbackClassName="networks-tab__content__icon-with-fallback"
              name={networkName}
            />
          )
        )}
        {isATestNetwork && chainId !== CHAIN_IDS.LINEA_GOERLI && (
          <UrlIcon
            name={networkName}
            fallbackClassName={classnames(
              'networks-tab__content__icon-with-fallback',
              {
                [`networks-tab__content__icon-with-fallback--color-${networkName}`]: true,
              },
            )}
          />
        )}
        <Text
          color={TextColor.textDefault}
          backgroundColor={BackgroundColor.transparent}
          variant={TextVariant.bodyMd}
          ellipsis
          marginLeft={2}
        >
          {networkName.length > MAXIMUM_CHARACTERS_WITHOUT_TOOLTIP ? (
            <Tooltip title={networkName} position="bottom">
              {networkName}
            </Tooltip>
          ) : (
            networkName
          )}
        </Text>
      </Box>

      <ToggleButton
        value={isShowIncomingTransactions}
        onToggle={(value) => toggleSingleNetwork(chainId, !value)}
        offLabel={t('off')}
        onLabel={t('on')}
      />
    </Box>
  );
};

export default NetworkToggle;

NetworkToggle.propTypes = {
  chainId: PropTypes.string.isRequired,
  networkPreferences: PropTypes.object.isRequired,
  toggleSingleNetwork: PropTypes.func.isRequired,
};
