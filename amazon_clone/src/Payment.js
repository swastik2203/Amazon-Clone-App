import {CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider'
import axios from './axios';
import { db } from './firebase';


function Payment() {

    const [{basket,user},dispatch] = useStateValue();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [error , setError] = useState(null);
    const [disabled , setDisabled] = useState(true);
    const [succeeded , setSucceeded] = useState(false);
    const [processing , setProcessing] = useState("");
    const [clientSecret , setClientSecret] = useState(true);

    useEffect(() => {
        //generate the special stripe secret which allows us to change
        const getClientSecret = async () => {
            const response = await axios({
                method:'post',
                //Stripe expects the total in a currencies subunits
                url:`/payment/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    },[basket]);

    console.log('THE SECRET IS >>>>',clientSecret);
    console.log('👦',user);


    const handleSubmit = async(event) => {
        //do all the fancy stuff of stripe
        event.preventDefault();
        setProcessing(true);
        
        
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                description: "test",
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {
            //paymentIntent = payment confirmation
            
            console.log("handleSubmit -> paymentIntent", paymentIntent)
            //pushing user data to firebase database 

            // these didn't work
            //.doc(paymentIntent.id)
            //amount: paymentIntent.amount,
            //created: paymentIntent.created
            db.collection('users')
              .doc(user?.uid)
              .collection('orders')
              .doc(user?.uid + parseInt(Date.now()/1000))
              .set({
                basket: basket,
                amount: getBasketTotal(basket),
                created: parseInt(Date.now()/1000)
               })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET',
            })

            navigate('/orders', {replace:true})
        })
        .catch(error);

    }

    const handleChange = event => {
        //Listen for changes in the cardElement
        // and display any errors at the customer types their card details
        setDisabled(event.empty);
        setError(event.error ?event.error.message : "")
    }
    

  return (
    <div className='payment'>

        <div className="payment_container">

            <h1>
                Checkout ({<Link to="/checkout">{basket?.length} items</Link>})
            </h1>

            {/* payment section - delivery address */}
            <div className="payment_section">
                <div className="payment_title">
                    <h3>Delivery Address</h3>
                </div>
                <div className="payment_address">
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>
                </div>
            </div>
            {/* payment section - review items */}
            <div className="payment_section">
                <div className="payment_title">
                    <h3>Review items and Delivery</h3>
                </div>
                <div className="payment_items">
                    {basket.map(item => (
                        <CheckoutProduct
                        id={item.id}
                        title={item.title}
                        price={item.price}
                        rating={item.rating}
                        image={item.image}
                        />
                    ))}
                </div>
                
            </div>
            {/* payment section - payment methods */}
            <div className="payment_section">
                <div className="payment_title">
                    <h3>Payment Method</h3>
                </div>
                <div className="payment_details">
                    {/* Stripe magic will go */}

                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange}/>

                        <div className='payment_priceContainer'>
                            <CurrencyFormat
                                renderText={(value) => (
                                <>
                                    <h3>Order Total: {value}</h3>
                                </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />
                            <button disabled={processing || disabled || succeeded}>
                                <span>
                                    {processing ? <p>Processing</p> : "Buy Now"} 
                                </span>
                            </button>
                        </div>

                        {/* Errors */}
                        {error && <div>{error}</div>}
                    </form>

                </div>
                
            </div>


        </div>

    </div>
  )
}

export default Payment