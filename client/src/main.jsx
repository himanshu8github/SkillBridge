import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51ROhjnP1hyDbZWao0XvqWtqYZicelqJ9l4xhxxWwgt3rYsJg1ONB6trB8eJDlX2TqlWTQJxQoPxHrT9kSUX1mZlW00vOVZ6uW5");

createRoot(document.getElementById('root')).render(
  
  <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App />
      </BrowserRouter> 
  </Elements>
)