"use client";

import { useLoadScript } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const libraries: any = ["places"];

export default function CheckoutPage() {
  const { cart } = useCart();

  // ✅ TOTAL FROM CART
  const totalAmount = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    apartment: "",
    city: "",
    pincode: "",
    state: "",
  });

  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ SHIPPING & ESTIMATED DELIVERY LOGIC
  const stateValue = form.state?.toLowerCase().trim();
  const isTamilNadu = !stateValue || stateValue === "tamil nadu" || stateValue === "tn";

  const baseShippingCharge: number = isTamilNadu ? 50 : 100;
  const shippingCharge: number = baseShippingCharge;
  
  // Calculate exact estimated delivery date range
  const today = new Date();
  const minDays = isTamilNadu ? 3 : 5;
  const maxDays = isTamilNadu ? 5 : 7;
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const estimatedDays = `${formatDate(minDate)} - ${formatDate(maxDate)}`;

  // ✅ FINAL TOTAL (FIXED)
  const finalTotal = totalAmount + shippingCharge;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
    libraries,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // ✅ GOOGLE AUTOCOMPLETE
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    // Use a small timeout to ensure DOM is ready
    setTimeout(() => {
      if (!inputRef.current) return;
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { componentRestrictions: { country: "in" } }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.geometry) return;

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode(
          { location: place.geometry.location },
          (results, status) => {
            if (status !== "OK" || !results || !results[0]) return;

            let city = "";
            let pincode = "";
            let state = "";

            results[0].address_components.forEach((component) => {
              const types = component.types;

              if (types.includes("locality")) city = component.long_name;
              if (!city && types.includes("administrative_area_level_2"))
                city = component.long_name;
              if (types.includes("postal_code")) pincode = component.long_name;
              if (types.includes("administrative_area_level_1"))
                state = component.long_name;
            });

            // Need to update the input's actual value for the controlled component sync
            if (inputRef.current) {
              inputRef.current.value = place.formatted_address || "";
            }

            setForm((prev: any) => ({
              ...prev,
              address: place.formatted_address || "",
              city,
              pincode,
              state,
            }));

            setAddressError("");
          }
        );
      });
    }, 100);
  }, [isLoaded]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ PLACE ORDER
  const handlePlaceOrder = async () => {
    setAddressError("");
    setPhoneError("");
    setEmailError("");
    setFirstNameError("");
    setLastNameError("");
    setCityError("");
    setStateError("");
    setPincodeError("");

    let hasError = false;

    if (!form.firstName.trim()) {
      setFirstNameError("First name is required");
      hasError = true;
    }

    if (!form.lastName.trim()) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    if (!form.city.trim()) {
      setCityError("City is required");
      hasError = true;
    }

    if (!form.state.trim()) {
      setStateError("State is required");
      hasError = true;
    }

    if (!form.pincode.trim()) {
      setPincodeError("Pincode is required");
      hasError = true;
    }

    if (!form.address.trim()) {
      setAddressError("Enter an address");
      hasError = true;
    }

    if (!form.phone) {
      setPhoneError("Phone number is required");
      hasError = true;
    } else if (form.phone.length !== 10) {
      setPhoneError("Enter valid 10-digit phone number");
      hasError = true;
    }

    if (!form.email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (hasError) return;
    
    setIsProcessing(true);

    const orderData = {
      ...form,
      items: cart,
      total: finalTotal,
      shipping: shippingCharge,
      whatsappUpdates,
      paymentMethod
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Something went wrong saving the order.");
        setIsProcessing(false);
        return;
      }
      
      const orderId = data.order.id;

      if (paymentMethod === "ONLINE") {
        const rzpLoaded = await loadRazorpay();
        if (!rzpLoaded) {
          alert("Razorpay SDK failed to load. Are you online?");
          setIsProcessing(false);
          return;
        }

        const rpRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const rpData = await rpRes.json();

        if (!rpData.order) {
          alert("Failed to create Razorpay order.");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: rpData.order.amount,
          currency: "INR",
          name: "Kirubai Masala",
          description: "Order Payment",
          order_id: rpData.order.id,
          handler: async function (response: any) {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: orderId 
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              completeOrderSuccess();
            } else {
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: form.firstName + " " + form.lastName,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#b91c1c",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
           alert("Payment Failed");
           setIsProcessing(false);
        });
        rzp.open();
      } else {
        completeOrderSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
      setIsProcessing(false);
    }
  };

  const completeOrderSuccess = () => {
    alert("🎉 Order placed successfully!");

    if (whatsappUpdates) {
      const message = encodeURIComponent(
        `🛒 *New Order - Kirubai Masala*\n\n👤 ${form.firstName} ${form.lastName}\n📞 ${form.phone}\n\n📍 ${form.address}, ${form.city}, ${form.state} - ${form.pincode}\n\n💰 Total: ₹${finalTotal}`
      );
      window.open(`https://wa.me/919790450986?text=${message}`, "_blank");
    }

    localStorage.removeItem("cart");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[150px] md:pt-[170px] px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-red-700 mb-6">
            Delivery Details
          </h2>

          <div className="space-y-4">
            <div className="space-y-5">

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`w-full border p-3 rounded text-black ${firstNameError ? 'border-red-500' : ''}`}
                  />
                  {firstNameError && <p className="text-red-500 text-sm mt-1">{firstNameError}</p>}
                </div>
                <div>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`w-full border p-3 rounded text-black ${lastNameError ? 'border-red-500' : ''}`}
                  />
                  {lastNameError && <p className="text-red-500 text-sm mt-1">{lastNameError}</p>}
                </div>
              </div>

              {/* Phone */}
              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full border p-3 rounded text-black ${phoneError ? 'border-red-500' : ''}`}
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={whatsappUpdates}
                  onChange={(e) => setWhatsappUpdates(e.target.checked)}
                />
                <label className="text-sm text-black">
                  Get order updates on WhatsApp
                </label>
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full border p-3 rounded text-black ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              {/* Address */}
              <div>
                <input
                  ref={inputRef}
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Search your address..."
                  autoComplete="new-password"
                  className={`w-full border p-3 rounded text-black ${addressError ? 'border-red-500' : ''}`}
                />
                {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
              </div>

              {/* City + State + Pincode */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full border p-3 rounded text-black ${cityError ? 'border-red-500' : ''}`}
                  />
                  {cityError && <p className="text-red-500 text-sm mt-1">{cityError}</p>}
                </div>

                <div>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`w-full border p-3 rounded text-black ${stateError ? 'border-red-500' : ''}`}
                  />
                  {stateError && <p className="text-red-500 text-sm mt-1">{stateError}</p>}
                </div>

                <div>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, pincode: value });
                    }}
                    placeholder="Pincode"
                    maxLength={6}
                    className={`w-full border p-3 rounded text-black ${pincodeError ? 'border-red-500' : ''}`}
                  />
                  {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-red-700 mb-4">
            Order Summary
          </h2>

          {cart.map((item: any) => (
            <div key={item.id} className="flex justify-between text-black mb-2">
              <div>
                <span className="block font-medium">{item.name}</span>
                <span className="text-sm text-gray-600">
                  {item.quantity} x {item.price} - {item.price * item.quantity}
                </span>
              </div>
              <span className="font-medium">₹ {item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>₹ {totalAmount}</span>
          </div>

          <div className="flex justify-between text-black">
            <span>Shipping</span>
            <span className={shippingCharge === 0 ? "text-green-600 font-bold" : ""}>
              {shippingCharge === 0 ? "FREE" : `₹ ${shippingCharge}`}
            </span>
          </div>

          <div className="mt-3 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
            <span>🚀 Estimated Delivery:</span>
            <span className="font-bold">{estimatedDays}</span>
          </div>

          <div className="flex justify-between text-black font-bold mt-4">
            <span>Total</span>
            <span>₹ {finalTotal}</span>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-black mb-3">Payment Method</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-black cursor-pointer">
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 text-black cursor-pointer">
                <input type="radio" name="paymentMethod" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
                Online Payment
              </label>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={isProcessing} className={`mt-6 w-full ${isProcessing ? 'bg-gray-400' : 'bg-red-700'} text-white py-3 rounded-lg`}>
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}