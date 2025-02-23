import { lazy } from "react";

export const publicRoutes = [
  {
    path: "/login",
    exact: true,
    element: lazy(() => import("./pages/auth/Login.jsx")),
  }
];

export const protectedRoutes = [
  {
    path: "/",
    exact: true,
    element: lazy(() => import("./pages/index.jsx")),
  },
  // {
  //   path: "/campaign/:id",
  //   exact: true,
  //   element: lazy(() => import("./pages/campaigns")),
  // },
  {
    path: "/campaign/:id",
    exact: true,
    element: lazy(() => import("./components/donation/Campaign.jsx")),
  },
  {
    path: "/about-us",
    exact: true,
    element: lazy(() => import("./pages/about-us/page.jsx")),
  },
  {
    path: "/privacy-policy",
    exact: true,
    element: lazy(() => import("./pages/privacy-policy/page.jsx")),
  },
  {
    path: "/profile",
    exact: true,
    element: lazy(() => import("./pages/profile/page.jsx")),
  },
  {
    path: "/terms",
    exact: true,
    element: lazy(() => import("./pages/terms/page.jsx")),
  },{
    path: "/checkout",
    exact: true,
    element: lazy(() => import("./components/Checkout.jsx")),
  },{
    path: "/explore-campaign",
    exact: true,
    element: lazy(() => import("./pages/explore/Explore.jsx")),
  },{
    path: "/faq",
    exact: true,
    element: lazy(() => import("./pages/faq/Page.jsx")),
  },
 
];
