
import { Outlet, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import SignIn from './Components/SignIn';
import TaskState from './Context/Tasks/TasksState';
import Tasks from './Components/TasksItem';
import CreateTask from './Components/CreateTask';
import Home from './Home';

function App() {
  return (
    <>
    <TaskState>
  
       <Navbar/>
        <Outlet/>
        <Footer/>
      </TaskState>

    </>
  );
}

const AppRouter= createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
      path:"/Tasks",
      element:<Tasks/>
    },
    {
      path:"/createTask",
      element:<CreateTask/>
    },
     
      {
        path:"/Signin",
        element:<SignIn/>
      },
      {
        path:"/SignUp",
        element:<Signup/>
      },
    ],
  },
]);
export default AppRouter;
