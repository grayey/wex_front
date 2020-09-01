import { lazy } from "react";
// import { authTasks } from "app/auth/authTasks";

const Tasks = lazy(() => import("./TasksComponent"));


const tasksRoutes = [
  {
    exact: true,
    path: "/dashboard/tasks",
    component: Tasks,
  }

];

export default tasksRoutes;
