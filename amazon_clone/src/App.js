import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from './Checkout';
import Login from './Login';
import {React, useEffect } from 'react';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import {loadStripe} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from './Orders';

function App() {

  const promise = loadStripe
  (
    "pk_test_51LJE2eSGB5H8RXftZ0KYVt8RV84NpjxS76Bet6XqejIWMZMEqb2ef1ZZWbLH8PhwY3B7MxEpKneVSInyzSdEd7or003MvsIxhD"

  )

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
              path = "/orders" 
              element={[<Header />,<Orders/>]} 
            />

          <Route 
              path = "/login" 
              element={<Login/>} 
            />

            <Route 
              path="/checkout" 
              element={[<Header />, <Checkout />]} 
            />

            <Route 
              path="/payment" 
              element={[<Header />, <Elements stripe={promise}> <Payment/></Elements> ]} 
            />

            <Route 
              exact path = "/" 
              element={[<Header />, <Home />]}  /* we can render header outside the Routes so that we don't have to repeat it in every page */
              
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
