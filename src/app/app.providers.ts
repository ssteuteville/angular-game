import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ENV_PROVIDERS } from './environment';
import { COMPONENT_PROVIDERS } from './components/index';

export const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  ENV_PROVIDERS,
  COMPONENT_PROVIDERS
];
