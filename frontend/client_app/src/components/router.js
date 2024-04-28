import {RouterProvider, createBrowserRouter, useNavigate} from "react-router-dom";
import HomePage from "../pages/HomePage";

import React from "react";
import SetupPage from "../pages/setupPage";
import ClientSearch from "../pages/clientSearch";
import ArticleVersions from "../pages/articleVersions";
import Header from "./header";
import Footer from "./footer";
import SpecificRun from "../pages/specificRun";
import Docs from "../pages/docs";
import Tutorial from "./docs/tutorial";

const router = createBrowserRouter([
  {
    path: "/",
    element: (<><Header/> <Footer/></>),
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path:'/setActive/:name',
        element: <SetupPage />
    
      },
      {
        path:'/search',
        element: <ClientSearch />
    
      },
      {
        path:'versions',
        element: <ArticleVersions/>
      },
      {
        path:'/lastRuns/:name/:creation',
        element: <SpecificRun/>
      },
      {
        path: '/docs',
        element: <Docs/>,
        children: [
          {
            path: '/docs/tutorial',
            element: <Tutorial/>
          }
        ]
      }


    ],
    
  },
  
]);

function Router() {
  return (
    <RouterProvider router={router}/>
  )
}

export default Router

{/**

import {RouterProvider, createBrowserRouter, useNavigate} from "react-router-dom";
import HomePage from "../pages/HomePage";

import React from "react";
import SetupPage from "../pages/setupPage";
import ClientSearch from "../pages/clientSearch";
import ArticleVersions from "../pages/articleVersions";
import Header from "./header";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header/>,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path:'/setActive/:name',
        element: <SetupPage />
    
      },
      {
        path:'/search',
        element: <ClientSearch />
    
      },
      {
        path:'versions',
        element: <ArticleVersions/>
      }

    ],
    
  },
  
]);

function Router() {
  return (
    <RouterProvider router={router}/>
  )
}

export default Router
*/}