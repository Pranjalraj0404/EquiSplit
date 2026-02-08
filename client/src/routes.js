import {useRoutes} from 'react-router-dom';

//Layouts 
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

//configfile import 
import configData from "./config.json"

//Pages 
import Login from './components/login';
import Register from './components/register'
import Page404 from './components/Page404';
import DashboardLayout from './layouts/dashboard';
import Profile from './components/profile';
import PageUserDeleted from './components/profile/PageUserDeleted';
import Group from './components/groups';
import CreateGroup from './components/groups/createGroup';
import ViewGroup from './components/groups/viewGroup';
import AddExpense from './components/expense/addExpense';
import Dashboard from './components/dashboard';
import { ViewExpense } from './components/expense/viewExpense';
import EditExpense from './components/expense/editExpense';
import { EditGroup } from './components/groups/editGroup';
import About from './components/about';


import LandingPage from './components/LandingPage';

export default function Router() {
  return useRoutes([
    {
      path: configData.DASHBOARD_HOME_URL,
      element: <DashboardLayout />,
      children: [
        {path:configData.DASHBOARD_URL,
        element: <Dashboard/>},
        {path: configData.CREATE_GROUP_URL,
        element: <CreateGroup/>},
        {path:configData.ADD_EXPENSE_ROUTER_URL,
        element: <AddExpense/>},
        {path:configData.EDIT_EXPENSE_ROUTER_URL,
          element: <EditExpense/>},
        {path:configData.VIEW_EXPENSE_ROUTER_URL,
          element: <ViewExpense/>},
        {path:configData.USER_GROUPS_URL,
          element: <Group/>},
        {path:configData.VIEW_GROUP_ROUTER_URL,
          element: <ViewGroup/>},
        {path:configData.EDIT_GROUP_ROUTER_URL,
          element: <EditGroup/>},
        // {path:configData.ABOUT_URL,
        //   element: <About/>},
        {path:configData.USER_PROFILE_URL,
          element: <Profile/>}
      ]
    },
    {
        path: '/',
        element: <LogoOnlyLayout />,
        children: [
            {path: '', element: <LandingPage/>},
            {path: 'login', element: <Login/>},
            {path: 'register', element: <Register/> },
            {path: configData.USER_DELETED_URL.substring(1), element: <PageUserDeleted/>},
            {path: 'about', element: <About/>}
        ]
    },
    {path: '*', element: <Page404/>}
  ])
}