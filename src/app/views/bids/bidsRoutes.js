import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const Bids = lazy(() => import("./bidsComponent"));


const bidRoutes = [
  {
    exact: true,
    path: "/dashboard/bids",
    component: Bids,
  }

];

export default bidRoutes;
