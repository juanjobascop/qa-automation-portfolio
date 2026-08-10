/**
 * Central test data for the SauceDemo UI suite.
 *
 * SauceDemo exposes several well-known accounts. Credentials live here (and are
 * public demo credentials, safe to commit) so tests read as intent rather than
 * magic strings.
 */
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  invalid: { username: 'no_such_user', password: 'wrong_password' },
} as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTshirt: 'Sauce Labs Bolt T-Shirt',
} as const;

export const checkoutInfo = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '28001',
} as const;
