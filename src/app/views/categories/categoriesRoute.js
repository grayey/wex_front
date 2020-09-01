import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const Categories = lazy(() => import("./CategoriesComponent"));


const categoryRoutes = [
  {
    exact: true,
    path: "/dashboard/categories",
    component: Categories,
  }

];

export default categoryRoutes;
