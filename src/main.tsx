import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import RootLayout from "./Layouts/Root"
import Login from "./pages/Login"
import PostPage from "./pages/PostPage"
import Posts from "./pages/Posts"
import Profile from "./pages/Profile"
import SavedPosts from "./pages/SavedPosts"
import queryClient from "./services/queryClient"
import LamaAuth from "./_features/LamaAuth/context"
import PrivilegedPage from "./_features/LamaAuth/PrivilegedPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <></>,
      },
      {
        path: "/profile",
        element: (
          <PrivilegedPage>
            <Profile />
          </PrivilegedPage>
        ),
      },
      {
        path: "/posts",
        element: (
          <PrivilegedPage>
            <Posts />
          </PrivilegedPage>
        ),
      },
      {
        path: "/saved-posts",
        element: (
          <PrivilegedPage>
            <SavedPosts />
          </PrivilegedPage>
        ),
      },
      {
        path: "/post/:postId",
        element: (
          <PrivilegedPage>
            <PostPage />
          </PrivilegedPage>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LamaAuth>
        <RouterProvider router={router} />
      </LamaAuth>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
