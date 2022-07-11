const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51LJE2eSGB5H8RXftbtwl0AvVbsTQCS7Vg4r944qArR7037BaBxgUA9mXhzkoraaVVf6LHp9OLij42hrNMpJA1yXR00wihPmpnu')

//API

//App config
const app = express();

//Middlewares
app.use(cors({origin: true}));

//API routes
app.get('/',(request,response) => {

    response.status(200).send('hello world');

});

app.post('/payment/create', async(request,response) => {
    const total = request.query.total;

    console.log('Payment Request Received Boom!!! for this amount >>>',total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,  //subunits of the currency
        currency: "usd",
    });

    //Ok - created
    response.status(201).send({
        clientSecret:paymentIntent.client_secret
    });
});


//Listen command
exports.api = functions.https.onRequest(app);


//example endPoint
// http://localhost:5001/clone-f7b14/us-central1/api
