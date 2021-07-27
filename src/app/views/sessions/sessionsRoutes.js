import { lazy } from "react";

const Signup = lazy(() => import("./Signup"));

const Signin = lazy(() => import("./Signin"));

const ForgotPassword = lazy(() => import("./ForgotPassword"));

const Error404 = lazy(() => import("./Error"));

const Home = lazy(()=> import("./IndexComponent") )

const NewHome = lazy(()=> import("./newIndexComponent"))

const ListeoHome = lazy(()=> import("./listeo/listeoIndexComponent"));
const ProductsListByCategory = lazy(()=> import("./listeo/productsListByCategory"));
const PublicProductView = lazy(()=> import("../products/publicProductView"));
const ProductSearchResult = lazy(() => import("../products/productSearchResult"));


  

const sessionsRoutes = [

  {
    exact:true,
    path:'/',
    component: ListeoHome
  },
  {
    exact:true,
    path:'/old-home',
    component: NewHome
  },
  {
    exact:true,
    path:'/new-home',
    component: Home
  },


  {
    exact: true,
    path: "/product/:slug",
    component: PublicProductView,
  },
  {
    exact: true,
    path: "/category/:slug",
    component: ProductsListByCategory,
  },
   {
    exact: true,
    path: "/product/:slug/bid",
    component: PublicProductView,
  },

  {
    exact: true,
    path: "/product/s/:slug/r",
    component: ProductSearchResult,
  },


  {
    path: "/signup",
    component: Signup
  },
  {
    path: "/signin",
    component: Signin
  },
  {
    path: "/forgot-password",
    component: ForgotPassword
  },
  {
    path: "/404",
    component: Error404
  }
];

export default sessionsRoutes;
