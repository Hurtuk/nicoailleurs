// hooks/useCurrency.js
import { useTranslation } from 'react-i18next';

export function useCurrency(currency = 'EUR') {
  const { i18n } = useTranslation();

  return (amount: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
}