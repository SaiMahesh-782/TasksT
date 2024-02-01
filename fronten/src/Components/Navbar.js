import React, { useContext ,useState,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TaskContext from '../Context/Tasks/TaskContext';

const Navbar = () => {
  const navigate = useNavigate();
  const context=useContext(TaskContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/SignIn');
  };
  const [loggedInUserName, setLoggedInUserName] = useState(null);
  const [users, setUsers] = useState([]);


  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/getUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        setLoggedInUserName(userData); // Log user data for debugging
        return userData.name;
      } else {
        throw new Error('Failed to fetch user information');
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
      throw error;
    }
  };
  
  
  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      fetchUserInfo(token)
        .then((userName) => setLoggedInUserName(userName))
        .catch((error) => console.error('Error fetching user information:', error));
    }
  }, []); // Corrected: empty dependency array or include `token` if used inside useEffect
  
  return (
    <div className='flex justify-between items-center bg-red-800 h-24'>
      <div className='flex items-center'>
        <img
          className='m-5 h-14 w-14 bg-white'
          src='https://robisearch.com/wp-content/uploads/2021/05/Task-Logo-fullcol-561x480.png'
          alt=''
        />
        <Link to='/Tasks'>
          <li className={`text-white mx-3 font-bold text-base list-none ${!localStorage.getItem('token') && 'cursor-not-allowed'}`} onClick={localStorage.getItem('token') ? null : (e) => e.preventDefault()}>
            Tasks
          </li>
        </Link>
        <Link to='/createTask'>
          <li className={`text-white mx-3 font-bold text-base list-none ${!localStorage.getItem('token') && 'cursor-not-allowed'}`} onClick={localStorage.getItem('token') ? null : (e) => e.preventDefault()}>
          createTask
          </li>
        </Link>
        
      </div>

      <ul className='m-5 p-4 flex cursor-pointer'>
  {localStorage.getItem('token') ? (
    // If token is present, show Logout button and logged-in user name
    <>
      <li className='px-3 text-white font-bold text-base'>
        {loggedInUserName}
      </li>
      
      
      <li onClick={handleLogout} className='px-3 text-white font-bold text-base'>
        Logout
      </li>

      
    </>
  ) : (
    // If no token, show SignIn and SignUp buttons
    <>
      <Link to='/Signin'>
        <li className='px-3 text-white font-bold text-base'>SignIn</li>
      </Link>
      <Link to='/SignUp'>
        <li className='px-3 text-white font-bold text-base'>SignUp</li>
      </Link>
    </>
  )}
</ul>

    </div>
  );
};

export default Navbar;
