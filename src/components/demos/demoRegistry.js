import { lazy } from 'react';

export const demos = {
  datanirnaya: lazy(() => import('./DatanirnayaDemo')),
  'multi-agent': lazy(() => import('./StrategyDemo')),
  pricing: lazy(() => import('./PricingDemo')),
  reporting: lazy(() => import('./ReportingDemo')),
  'supply chain': lazy(() => import('./SupplyChainDemo')),
  mmm: lazy(() => import('./MarketingDemo')),
};
