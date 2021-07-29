import React from "react";
import { Redirect } from "react-router-dom";
import dashboardRoutes from "./views/dashboard/dashboardRoutes";
import uiKitsRoutes from "./views/ui-kits/uiKitsRoutes";
import formsRoutes from "./views/forms/formsRoutes";
import sessionsRoutes from "./views/sessions/sessionsRoutes";
import PublicLayout from "./PublicLayout";
import AuthGuard from "./auth/AuthGuard";
import widgetsRoute from "./views/widgets/widgetsRoute";
import chartsRoute from "./views/charts/chartsRoute";
import dataTableRoute from "./views/dataTable/dataTableRoute";
import extraKitsRoutes from "./views/extra-kits/extraKitsRoutes";
import pagesRoutes from "./views/pages/pagesRoutes";
import iconsRoutes from "./views/icons/iconsRoutes";
import invoiceRoutes from "./views/app/invoice/invoiceRoutes";
import inboxRoutes from "./views/app/inbox/inboxRoutes";
import chatRoutes from "./views/app/chat/chatRoutes";
import calendarRoutes from "./views/app/calendar/calendarRoutes";
import taskManagerRoutes from "./views/app/task-manager/taskManagerRoutes";
import ecommerceRoutes from "./views/app/ecommerce/ecommerceRoutes";
import contactRoutes from "./views/app/contact/contactRoutes";
import categoriesRoutes from "./views/categories/categoriesRoute";
import rolesRoutes from "./views/roles/rolesRoutes";
import tasksRoutes from "./views/tasks/tasksRoutes";
import usersRoutes from "./views/users/usersRoutes";
import productsRoutes from "./views/products/productsRoutes";
import bidRoutes from "./views/bids/bidsRoutes";
import userChatRoutes from "./views/chats/chatRoutes";
import walletTransactionsRoutes from "./views/wallet-and-transactions/walletTransactionRoutes";


const redirectRoute = [
  {
    path: "/xx",
    exact: true,
    component: () => <Redirect to="/dashboard/v1" />
  }
];


const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />
  }
];

const routes = [
  // ...sessionsRoutes,
  {
    path: "/dashboard",
    component: AuthGuard,
    routes: [
      ...dashboardRoutes,
      ...categoriesRoutes,
      ...tasksRoutes,
      ...rolesRoutes,
      ...usersRoutes,
      ...productsRoutes,
      ...bidRoutes,
      ...walletTransactionsRoutes,
      ...userChatRoutes,
      
      ...uiKitsRoutes,
      ...formsRoutes,
      ...widgetsRoute,
      ...chartsRoute,
      ...dataTableRoute,
      ...extraKitsRoutes,
      ...pagesRoutes,
      ...iconsRoutes,
      ...invoiceRoutes,
      ...inboxRoutes,
      ...chatRoutes,
      ...taskManagerRoutes,
      ...calendarRoutes,
      ...ecommerceRoutes,
      ...contactRoutes,
    ]
  },
  {
    path:"/",
    component:PublicLayout,
    routes:[
      ...sessionsRoutes,
          // Load these last
          ...redirectRoute,
          ...errorRoute,
    ]
  },
 
];

export default routes;
