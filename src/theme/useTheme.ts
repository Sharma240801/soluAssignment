import { useStoreConfigStore } from '../store';
import { AppTheme, typography, spacing, borderRadius } from './theme';

export function useTheme(): AppTheme {
  const config = useStoreConfigStore((state) => state.config);

  const isDark = config.id === 'fitwear';

  return {
    colors: config.theme,
    typography,
    spacing,
    borderRadius,
    isDark,
  };
}

