import { Login, ForgotPassword, ResetPassword, ProtectedRoutes, IsAuthRedirect } from "@auth/components";
import Layout from "@components/layout";
import AuthLayout from "@components/layout/auth";
import Dashboard from "@dashboard/components";
import Booking from "@booking/components";
import Finance from "@finance/components";
import Projects from "@projects/components";
import Contacts from "@contacts/components";
import Groups from "@groups/components";
import Loading from "@components/loading";
import _404_NOT_FOUND from "@components/404";

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
    path: "/bookings",
    element: <Booking />,
  },
  {
    path: "/finance",
    element: <Finance />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/groups",
    element: <Groups />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
];

const routes = [
  // Auth routes
  {
    element: <Loading />,
    children: [
      {
        element: <IsAuthRedirect />,
        children: [
          {
            element: <AuthLayout />,
            children: authRoutes,
          },
        ],
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
        element: <_404_NOT_FOUND />,
      },
    ],
  },
];

export default routes;
