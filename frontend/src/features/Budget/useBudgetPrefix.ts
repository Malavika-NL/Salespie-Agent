import { useLocation } from 'react-router-dom';

/**
 * Returns the correct route prefix based on current URL.
 * If path starts with /user/ → returns "/user"
 * Otherwise (admin) → returns ""
 */
export const useBudgetPrefix = (): string => {
  const location = useLocation();
  return location.pathname.startsWith('/user/') ? '/user' : '';
};