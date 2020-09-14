import { lazy } from "react";

const Signup = lazy(() => import("./Signup"));

const Signin = lazy(() => import("./Signin"));

const ForgotPassword = lazy(() => import("./ForgotPassword"));

const Error404 = lazy(() => import("./Error"));

const Home = lazy(()=> import("./IndexComponent") )

const NewHome = lazy(()=> import("./newIndexComponent"))

const sessionsRoutes = [
  {
    exact:true,
    path:'/',
    component: NewHome
  },

  {
    exact:true,
    path:'/new-home',
    component: Home
  },

  {
    path: "/session/signup",
    component: Signup
  },
  {
    path: "/session/signin",
    component: Signin
  },
  {
    path: "/session/forgot-password",
    component: ForgotPassword
  },
  {
    path: "/session/404",
    component: Error404
  }
];

export default sessionsRoutes;
