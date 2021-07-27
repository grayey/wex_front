import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const Products = lazy(() => import("./productsComponent"));
const DashboardProductView = lazy(() => import("./dashboardProductView"));



const productRoutes = [
  {
    exact: true,
    path: "/dashboard/products",
    component: Products,
  },
  {
    exact: true,
    path: "/dashboard/products/:slug",
    component: DashboardProductView,
  },
 

];

export default productRoutes;
