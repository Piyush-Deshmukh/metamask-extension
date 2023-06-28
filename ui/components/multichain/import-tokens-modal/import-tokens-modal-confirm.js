import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  Text,
} from '../../component-library';
import {
  AlignItems,
  Display,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import TokenBalance from '../../ui/token-balance/token-balance';
import Identicon from '../../ui/identicon';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { getPendingTokens } from '../../../ducks/metamask/metamask';

export const ImportTokensModalConfirm = ({ onBackClick, onImportClick }) => {
  const t = useI18nContext();
  const pendingTokens = useSelector(getPendingTokens);

  return (
    <Box paddingTop={0} paddingRight={6} paddingBottom={6} paddingLeft={6}>
      <Text>{t('likeToImportTokens')}</Text>
      <Box marginTop={4} marginBottom={4}>
        <Box display={Display.Flex}>
          <Text
            variant={TextVariant.bodySm}
            className="import-tokens-modal__token-name"
          >
            {t('token')}
          </Text>
          <Text
            variant={TextVariant.bodySm}
            className="import-tokens-modal__token-balance"
          >
            {t('balance')}
          </Text>
        </Box>
        <Box
          display={Display.Flex}
          className="import-tokens-modal__confirm-token-list"
        >
          {Object.entries(pendingTokens).map(([address, token]) => {
            const { name, symbol } = token;
            return (
              <Box
                key={address}
                marginBottom={4}
                display={Display.Flex}
                className="import-tokens-modal__confirm-token-list-item"
              >
                <Box
                  display={Display.Flex}
                  alignItems={AlignItems.center}
                  className="import-tokens-modal__confirm-token-list-item-wrapper"
                >
                  <Identicon diameter={36} address={address} />
                  <Box marginInlineStart={4}>
                    <Text>{name}</Text>
                    <Text
                      variant={TextVariant.bodySm}
                      color={TextColor.textAlternative}
                    >
                      {symbol}
                    </Text>
                  </Box>
                </Box>
                <Box
                  className="import-tokens-modal__token-balance"
                  alignItems={AlignItems.flexStart}
                >
                  <TokenBalance token={token} />
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box display={Display.Flex} gap={2} marginTop={4}>
          <ButtonSecondary onClick={onBackClick} block>
            {t('back')}
          </ButtonSecondary>
          <ButtonPrimary
            onClick={onImportClick}
            block
            data-testid="import-tokens-modal-import-button"
          >
            {t('import')}
          </ButtonPrimary>
        </Box>
      </Box>
    </Box>
  );
};

ImportTokensModalConfirm.propTypes = {
  onBackClick: PropTypes.func.isRequired,
  onImportClick: PropTypes.func.isRequired,
};
