import { lazy } from "react";

const WalletTransactions = lazy(() => import("./walletTransactions"));


const walletTransactionsRoutes = [
  {
    exact: true,
    path: "/dashboard/wallet-and-transactions",
    component: WalletTransactions,
  },
];

export default walletTransactionsRoutes;
