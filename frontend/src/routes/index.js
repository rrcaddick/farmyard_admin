import { Login, ForgotPassword, ResetPassword, ProtectedRoutes, IsAuthRedirect } from "@auth/components";
import Layout from "@components/layout";
import Booking from "@booking/components";
import Dashboard from "@dashboard/components";

const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:userId/:token",
    element: <ResetPassword />,
  },
];

const appRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/booking",
    element: <Booking />,
  },
];

const routes = [
  // Auth routes
  {
    element: <IsAuthRedirect />,
    children: authRoutes,
  },
  // App Routes
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: appRoutes,
      },
    ],
  },
  // Not Found
  // TODO: Add 404 not found with lottie sheep
  {
    path: "*",
    element: "Not found",
  },
];

export default routes;
