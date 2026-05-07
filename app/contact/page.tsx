"use client";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock3,
} from "lucide-react";

export default function ContactPage() {
const formRef = useRef<HTMLFormElement>(null);

const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const sendEmail = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formRef.current) return;

  try {
    setLoading(true);

    await emailjs.sendForm(
      "service_sn4itxd",
      "template_asaow1r",
      formRef.current,
      "90Q6ceEnDMUL_CZDp"
    );

    setSuccess(true);
    formRef.current.reset();
  } catch (error) {
    console.error(error);
    alert("Failed to send message.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="w-full min-h-screen bg-[#f8f6f1] overflow-x-hidden">

      {/* HERO */}
      <section className="pt-52 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl text-[#1f4d3a] font-semibold mb-4">
          Contact Us
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          We would love to hear from you. <br />
          Reach out to us for enquiries, feedback, collaborations or support.
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — FORM */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">

            <h2 className="text-3xl font-semibold text-[#1f4d3a] mb-8">
              Send us a Message
            </h2>

            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">

              <input
                type="text"
                name="from_name"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]"
              />

              <input
                type="email"
                name="from_email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]"
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]"
              />

              <textarea
                rows={5}
                name="message"
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#1f4d3a]"
              ></textarea>

              <button
  type="submit"
  disabled={loading}
  className="bg-[#1f4d3a] text-white px-10 py-4 rounded-full hover:bg-[#17382b] transition"
>
  {loading ? "Sending..." : "Send Message"}
</button>
{success && (
  <p className="text-green-700 font-medium">
    Message sent successfully!
  </p>
)}

            </form>
          </div>

          {/* RIGHT — CONTACT INFO */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10">

            <h2 className="text-3xl font-semibold text-[#1f4d3a] mb-8">
              Get in Touch
            </h2>

            {/* ADDRESS */}
            <div className="flex items-start gap-4 mb-8">
              <MapPin className="text-[#1f4d3a] mt-1" />

              <div>
                <h3 className="text-xl font-medium text-[#1f4d3a] mb-1">
                  Address
                </h3>

                <p className="text-gray-700 leading-relaxed">
                  Deborah Foods and Spices <br />
                  No:12, Anjugam Nagar Main Road, <br />
                  Kolathur, Chennai - 600099. <br />
                  Tamil Nadu, India.
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-start gap-4 mb-8">
              <Phone className="text-[#1f4d3a] mt-1" />

              <div>
                <h3 className="text-xl font-medium text-[#1f4d3a] mb-1">
                  Phone
                </h3>

                <p className="text-gray-700">+91 8754059548</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-start gap-4 mb-8">
              <Mail className="text-[#1f4d3a] mt-1" />

              <div>
                <h3 className="text-xl font-medium text-[#1f4d3a] mb-1">
                  Email
                </h3>

                <p className="text-gray-700">
                  deborahfoodsandspices@gmail.com
                </p>
              </div>
            </div>

            {/* WORK HOURS */}
            <div className="flex items-start gap-4 mb-10">
              <Clock3 className="text-[#1f4d3a] mt-1" />

              <div>
                <h3 className="text-xl font-medium text-[#1f4d3a] mb-1">
                  Working Hours
                </h3>

                <p className="text-gray-700">
                  Monday - Saturday <br />
                  9 AM — 7 PM
                </p>
              </div>
            </div>

            {/* SOCIAL */}
            <div>
              <h3 className="text-xl font-medium text-[#1f4d3a] mb-5">
                Follow Us
              </h3>

              <div className="flex gap-4 flex-wrap">

                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center border border-[#1f4d3a] rounded-full text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition"
                >
                  <Facebook size={20} />
                </a>

                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center border border-[#1f4d3a] rounded-full text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition"
                >
                  <Instagram size={20} />
                </a>

                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center border border-[#1f4d3a] rounded-full text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition"
                >
                  <Youtube size={20} />
                </a>

                <a
                  href="tel:+91XXXXXXXXXX"
                  className="w-12 h-12 flex items-center justify-center border border-[#1f4d3a] rounded-full text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition"
                >
                  <Phone size={20} />
                </a>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* MAP */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-lg">

          <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.641405391844!2d80.21983877330635!3d13.12188871156911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52645714c87a2f%3A0x4f9d2fc7561af927!2s12%2C%20Anjugam%20Nagar%20Main%20Rd%2C%20Anjugam%20Nagar%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600099!5e0!3m2!1sen!2sin!4v1778153914064!5m2!1sen!2sin"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

        </div>
      </section>

    </main>
  );
}