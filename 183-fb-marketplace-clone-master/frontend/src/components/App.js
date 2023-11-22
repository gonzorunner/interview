import React, {useState} from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';


/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(loggedInUser);
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Home user={user} logout={logout} />
        </Route>
        {user ? (
          <Redirect to='/' />
        ) : (
          <Route path='/login'>
            <Login setUser={setUser} />
          </Route>
        )}
        {user ? (
          <Redirect to='/' />
        ) : (
          <Route path='/sign-up'>
            <SignUp setUser={setUser} />
          </Route>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
