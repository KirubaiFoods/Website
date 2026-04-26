"use client";

import { useLoadScript } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

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

  // ✅ SHIPPING LOGIC (FIXED)
  const stateValue = form.state?.toLowerCase().trim();

  const shippingCharge =
    form.address && stateValue
      ? stateValue === "tamil nadu"
        ? 50
        : 100
      : 0;

  // ✅ FINAL TOTAL (FIXED)
  const finalTotal = totalAmount + shippingCharge;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const libraries: any = ["places"];

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAQFbOQS97H_KQNIHFIKUnrbR8M7-ytP7w", // 🔒 keep safe
    libraries,
  });

  const inputRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  // ✅ GOOGLE AUTOCOMPLETE
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      { componentRestrictions: { country: "in" } }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();

      if (!place || !place.geometry) return;

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { location: place.geometry.location },
        (results: any, status: any) => {
          if (status !== "OK" || !results[0]) return;

          let city = "";
          let pincode = "";
          let state = "";

          results[0].address_components.forEach((component: any) => {
            const types = component.types;

            if (types.includes("locality")) city = component.long_name;
            if (!city && types.includes("administrative_area_level_2"))
              city = component.long_name;
            if (types.includes("postal_code")) pincode = component.long_name;
            if (types.includes("administrative_area_level_1"))
              state = component.long_name;
          });

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
  }, [isLoaded]);

  // ✅ PLACE ORDER
  const handlePlaceOrder = async () => {
    let hasError = false;

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

    const orderData = {
      ...form,
      items: cart,
      total: finalTotal,
      shipping: shippingCharge,
      whatsappUpdates,
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

      if (data.success) {
        alert("🎉 Order placed successfully!");

        // ✅ WhatsApp (optional)
        if (whatsappUpdates) {
          const message = encodeURIComponent(
            `🛒 *New Order - Kirubai Masala*

👤 ${form.firstName} ${form.lastName}
📞 ${form.phone}

📍 ${form.address}, ${form.city}, ${form.state} - ${form.pincode}

💰 Total: ₹${finalTotal}`
          );

          window.open(`https://wa.me/919790450986?text=${message}`, "_blank");
        }

        // ✅ CLEAR CART (BEST WAY)
        localStorage.removeItem("cart");
        window.location.reload();

        // ✅ RESET FORM
        setForm({
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
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
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
    <input
      name="firstName"
      value={form.firstName}
      onChange={handleChange}
      placeholder="First Name"
      className="w-full border p-3 rounded text-black"
    />
    <input
      name="lastName"
      value={form.lastName}
      onChange={handleChange}
      placeholder="Last Name"
      className="w-full border p-3 rounded text-black"
    />
  </div>

  {/* Phone */}
  <input
    name="phone"
    value={form.phone}
    onChange={handleChange}
    placeholder="Phone Number"
    className="w-full border p-3 rounded text-black"
  />

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
  <input
    name="email"
    value={form.email}
    onChange={handleChange}
    placeholder="Email Address"
    className="w-full border p-3 rounded text-black"
  />

  {/* Address */}
  <input
  ref={inputRef}
  value={form.address}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      address: e.target.value,
    }))
  }
  placeholder="Address"
  className="w-full border p-3 rounded text-black"
/>

  {/* City + State + Pincode */}
  <div className="grid grid-cols-3 gap-4">
    <input
      name="city"
      value={form.city}
      onChange={handleChange}
      placeholder="City"
      className="w-full border p-3 rounded text-black"
    />

    <input
      name="state"
      value={form.state}
      onChange={handleChange}
      placeholder="State"
      className="w-full border p-3 rounded text-black"
    />

    <input
      name="pincode"
      value={form.pincode}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        setForm({ ...form, pincode: value });
      }}
      placeholder="Pincode"
      maxLength={6}
      className="w-full border p-3 rounded text-black"
    />
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
            <div key={item.id} className="flex justify-between text-black">
              <span>{item.name} x {item.quantity}</span>
              <span>₹ {item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>₹ {totalAmount}</span>
          </div>

          <div className="flex justify-between text-black">
            <span>Shipping</span>
            <span>₹ {shippingCharge}</span>
          </div>

          <div className="flex justify-between text-black font-bold mt-4">
            <span>Total</span>
            <span>₹ {finalTotal}</span>
          </div>

          <button onClick={handlePlaceOrder} className="mt-6 w-full bg-red-700 text-white py-3 rounded-lg">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}