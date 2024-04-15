import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from '/src/pages/Home.jsx'
import Navbar from './components/Navbar.jsx'
import AboutUs from '/src/pages/AboutUs.jsx'
import SignIn from '/src/pages/SignIn.jsx'
import SignUp from '/src/pages/SignUp.jsx'
import ResetPassword from '/src/pages/ResetPassword.jsx'
import Profile from '/src/pages/Profile.jsx'
import Cart from '/src/pages/Cart.jsx'
import Success from '/src/pages/Success.jsx'
import Cancel from '/src/pages/Cancel.jsx'
import Products from '/src/pages/Products.jsx'
import Search from '/src/pages/Search.jsx'
import IndividualProduct from '/src/components/IndividualProduct.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about-us',
        element: <AboutUs />
      },
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/success',
        element: <Success />
      },
      {
        path: '/cancel',
        element: <Cancel />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/products/:id',
        element: <IndividualProduct />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
