import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const Roles = lazy(() => import("./RolesComponent"));
const RoleDetailComponent = lazy(() => import("./RoleDetailComponent"));


const rolesRoutes = [
  {
    exact: true,
    path: "/dashboard/roles",
    component: Roles,
  },
  {
    exact: true,
    path:"/dashboard/roles/:slug",
    component:RoleDetailComponent

  }

];

export default rolesRoutes;
