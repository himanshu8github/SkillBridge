import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { jwtDecode } from "jwt-decode"; 
import { BACKEND_URL } from "../utils/utils";


const  Buy = ()=>{
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const decodedUser = token ? jwtDecode(token) : null;

  console.log("Decoded token:", decodedUser);
  console.log(jwtDecode(token));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors || "Something went wrong");
        }
      }
    };

    fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Elements not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (!card) {
      console.log("CardElement not found");
      setLoading(false);
      return;
    }

    const { error: paymentMethodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (paymentMethodError) {
      setCardError(paymentMethodError.message);
      setLoading(false);
      return;
    }

    console.log("[PaymentMethod Created]", paymentMethod);

    if (!clientSecret) {
      setCardError("Client secret not found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: decodedUser?.firstName ,
            email: decodedUser?.email ,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: decodedUser?.email,
        userId: decodedUser?.id,
        courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log(paymentInfo)
      try {
        const response = await axios.post(
          `${BACKEND_URL}/order`,
          paymentInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Order stored:", response.data);
        toast.success("Payment Successful");
        navigate("/purchases");
      } catch (err) {
        console.error(err);
        toast.error("Error storing order");
      }
    }

    setLoading(false);
  };

  return (
    <>
       {error ? (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black to-blue-950 px-4">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              to="/purchases"
              className="w-full inline-block mt-4 bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition duration-200"
            >
              Go to Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-black to-blue-950 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 grid md:grid-cols-2 gap-6"
          >
            {/* Left side: Order details */}
            <div>
              <h1 className="text-xl font-bold underline text-gray-800 mb-4">Order Details</h1>
              <div className="mb-3">
                <h2 className="text-gray-600 text-sm">Course name:</h2>
                <p className="text-blue-700 font-bold">{course?.title}</p>
              </div>
              <div>
                <h2 className="text-gray-600 text-sm">Total Price:</h2>
                <p className="text-green-600 font-bold">${course?.price}</p>
              </div>
            </div>

            {/* Right side: Payment form */}
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">Process your Payment</h2>
              <form onSubmit={handlePurchase}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Credit/Debit Card</label>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": { color: "#aab7c4" },
                        },
                        invalid: { color: "#9e2146" },
                      },
                    }}
                  />
                  {cardError && (
                    <p className="text-red-500 font-semibold text-xs mt-2">{cardError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>
              
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Buy;