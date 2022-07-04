import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from './Checkout';
import Login from './Login';
import {React, useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';

function App() {

  const [{}, dispatch] = useStateValue();

  useEffect(() => {
     //will run only once when the app component loads...
     auth.onAuthStateChanged(authUser => {
       console.log("the user is >>>",authUser);

       if(authUser)
       {
          // the user just logged in / the user was logged in
          dispatch({
            type: 'SET_USER',
            user: authUser
          })
       }
       else 
       { //the user was logged out
          dispatch({
            type: 'SET_USER',
            user: null
          })
       }

     })

  },[])



  return (
    //BEM convention
    <Router>
      <div className="app">
        
        <Routes>

          <Route 
              path = "/login" 
              element={<Login/>} 
            />

            <Route 
              path = "/" 
              element={[<Header />, <Home />]}  /* we can render it outside the Routes so that we don't have to repeat it in every page */
              
            />

            <Route 
              path="/checkout" 
              element={[<Header />, <Checkout />]} 
            />

            {/* <Route 
              path = "/login" 
              element={<Login />} 
            /> */}

        </Routes>
        
       </div>
    </Router>
  );
}

export default App;
