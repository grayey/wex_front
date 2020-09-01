import { lazy } from "react";
// import { authUsers } from "app/auth/authUsers";

const Users = lazy(() => import("./UsersComponent"));
const UserDetailComponent = lazy(() => import("./UserDetailComponent"));


const usersRoutes = [
  {
    exact: true,
    path: "/dashboard/users",
    component: Users,
  },
  {
    exact: true,
    path:"/dashboard/users/:slug",
    component:UserDetailComponent

  }

];

export default usersRoutes;
