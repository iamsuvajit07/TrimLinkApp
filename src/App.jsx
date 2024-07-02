import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/app-layout';
import LandingPage from './pages/landing';
import Dashboard from './pages/dashboard';
import Auth from './pages/auth';
import Link from './pages/link';
import RedirectLink from './pages/redirect-link';
import UrlProvider from './context';
import RequireAuth from './components/require-auth';


const router = createBrowserRouter(
  //array of the routes
  [
  { //object for our layout
    element:<AppLayout/>,
    children:[
      {
        path:'/', //landing page or home page
        element:<LandingPage/>
      },
      {
        path:'/auth',
        element:<Auth/>
      },
      {
        path:'/dashboard', //dashboard page
        element: (
          <RequireAuth>
            <Dashboard/>
          </RequireAuth>
        )
      },
      
      {
        path:'/link/:id',
        element: (
          <RequireAuth>
            <Link/>
          </RequireAuth>
        )
      },
      {
        path:'/:id',
        element:<RedirectLink/>
      },
    ]
  }
])

function App() {

  return <UrlProvider>
    <RouterProvider router={router}/>
  </UrlProvider>
}

export default App;
