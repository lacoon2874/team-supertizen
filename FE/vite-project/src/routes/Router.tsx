// import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "@/pages/SmartThings/Login";
import SmartThings from "@/pages/SmartThings/SmartThings";
// import PageNotFound from "@/pages/PageNotFound";
import AddDevice from "@/pages/SmartThings/Device";
import Agreement from "@/pages/SmartThings/Agreement";
///////////메인
import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import Closet from "@/pages/Closet";
import Basket from "@/pages/Basket";
////////////홈 하위
import TodaySchedule from "@/sections/today_info/TodaySchedule";
import HomeLocate from "@/sections/weather_location/HomeLocate";
import FixHomeCurrentClothes from "@/sections/fix_current_clothes/FixHomeCurrentClothes";
///////////캘린더 하위
import MyCalendar from "@/sections/calendar/Calendar";
import Recommend from "@/sections/calendar/Recommend";
import Past from "@/sections/calendar/Past";
import MakeOutfit from "@/sections/calendar/makeoutfit/MakeOutfit";
import ConfirmOutfit from "@/sections/calendar/confirmoutfit/ConfirmOutfit";
////////////옷장 하위
import MyCloset from "@/sections/closet/MyCloset";
import DetailClothes from "@/sections/closet/DetailClothes";
import UpdateClothes from "@/sections/closet/UpdateClothes";

const router = createBrowserRouter([
  {
    path: "",
    element: <Login />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      // 처음 진입 페이지
      {
        path: "/smarthome",
        element: <SmartThings />,
      },
      {
        path: "/device",
        element: <AddDevice />,
      },
      {
        path: "/agreement",
        element: <Agreement />,
      },
      // 우리 서비스 메인 Navbar
      {
        path: "/home",
        element: <Home />,
        children: [
          {
            path: "",
            element: <><HomeLocate /><TodaySchedule /></>,
          },
          {
            path: "currentclothes",
            element: <><FixHomeCurrentClothes /></>,
          },
        ],
      },

      {
        path: "/calendar",
        element: <Calendar />,
        children: [
          {
            path: "",
            element: <MyCalendar />,
          },
          {
            path: "recommend",
            element: <Recommend />,
          },
          {
            path: "past",
            element: <Past />,
          },
          {
            path: "makeoutfit",
            element: <MakeOutfit />,
          },
          {
            path: "confirmoutfit",
            element: <ConfirmOutfit />,
          },
        ],
      },
      {
        path: "/closet",
        element: <Closet />,
        children: [
          {
            path: "",
            element: <MyCloset />,
          },
          {
            path: ":id",
            element: <DetailClothes />,
          },
          {
            path: "update/:id",
            element: <UpdateClothes />,
          },
        ],
      },
      {
        path: "/basket",
        element: <Basket />,
      },
    ],
  },
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
]);

export default router;

// {
//   path: "",
//   // 3초 뒤에 finish가 반환된다.
//   loader: async () => {
//     return new Promise((res) => {
//       setTimeout(() => {
//         return res("finish!");
//       }, 3000);
//     });
//   },
//   element: <Intro />,
// },

// import DashboardLayout from "src/layouts/dashboard";

// export const IndexPage = lazy(() => import("src/pages/app"));
// export const BlogPage = lazy(() => import("src/pages/blog"));
// export const UserPage = lazy(() => import("src/pages/user"));
// export const LoginPage = lazy(() => import("src/pages/login"));
// export const ProductsPage = lazy(() => import("src/pages/products"));
// export const Page404 = lazy(() => import("src/pages/page-not-found"));

// // ----------------------------------------------------------------------

// interface RouterProps {
//   element: ReactElement;
//   children?: RouteObject[];
//   path?: string;
// }

// export default function Router(): ReactElement {
//   const routes: RouteObject[] = useRoutes([

// 		{
//       element: (
//         <DashboardLayout>
//           <Suspense fallback={<div>Loading...</div>}>
//             <Outlet />
//           </Suspense>
//         </DashboardLayout>
//       ),
//       children: [
//         { element: <IndexPage />, index: true },
//         { path: "user", element: <UserPage /> },
//         { path: "products", element: <ProductsPage /> },
//         { path: "blog", element: <BlogPage /> },
//       ],
//     },
//     {
//       path: "login",
//       element: <LoginPage />,
//     },
//     {
//       path: "404",
//       element: <Page404 />,
//     },
//     {
//       path: "*",
//       element: <Navigate to="/404" replace />,
//     },
//   ]);

//   return routes;
// }
