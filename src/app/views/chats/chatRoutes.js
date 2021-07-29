import { lazy } from "react";
import { authRoles } from "app/auth/authRoles";

const BidChat = lazy(() => import("./bidChat"));
const MyChat = lazy(() => import("./myChat"));

const chatRoutes = [
  {
    exact: true,
    path: "/dashboard/bids/:id/chat",
    component: BidChat,
  },
  {
    exact: true,
    path: "/dashboard/my-chats",
    component: MyChat,
  },
];

export default chatRoutes;
