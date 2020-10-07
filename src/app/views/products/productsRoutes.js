import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const Products = lazy(() => import("./productsComponent"));


const productRoutes = [
  {
    exact: true,
    path: "/dashboard/products",
    component: Products,
  }

];

export default productRoutes;
