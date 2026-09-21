import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { money as formatMoney } from '@/lib/format';
import { BaseCurrency } from '@/types';

export function useMoney() {
  const { baseCurrency } = useAuth();
  const currency: BaseCurrency = baseCurrency;

  const money = useCallback((value: number) => formatMoney(value, currency), [currency]);

  return { currency, money };
}
