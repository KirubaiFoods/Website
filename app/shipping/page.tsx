export default function ShippingPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 md:px-8">
      <div className="max-w-6xl ml-3 md:ml-12 lg:ml-20 mr-3 md:mr-6">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f4d3a] mb-4">
            Shipping Policy
          </h1>

          <p className="mb-4">
            Last updated: May 07, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-[#2d2d2d] leading-8 text-[12px] md:text-lg">

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Overview
            </h2>

            <p className="mb-4">
              At Kirubai Masala, we are committed to delivering your orders
              safely and on time. This Shipping Policy outlines our shipping
              process, timelines, and delivery charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Order Processing
            </h2>

            <p className="mb-4">
              Orders are usually processed within 1–2 business days after
              payment confirmation. Orders placed on Sundays or public holidays
              will be processed on the next working day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Shipping Charges
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Free shipping for orders above ₹499 within Tamil Nadu.</li>
              <li>Shipping charges may vary based on location and order value.</li>
              <li>
                Additional delivery charges may apply for remote locations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Estimated Delivery Time
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              <li>Within Tamil Nadu: 2–4 business days</li>
              <li>Outside Tamil Nadu: 4–7 business days</li>
              <li>
                Delivery timelines may vary during festivals, holidays,
                or unforeseen circumstances.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Order Tracking
            </h2>

            <p className="mb-4">
              Once your order is shipped, tracking details will be shared
              through email, or WhatsApp whenever available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Delivery Issues
            </h2>

            <p className="mb-4">
              If your package is delayed, damaged, or not delivered,
              please contact us immediately so we can assist you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Incorrect Address
            </h2>

            <p className="mb-4">
              Customers are responsible for providing accurate shipping
              information. Kirubai Masala will not be responsible for delays
              or failed deliveries caused by incorrect addresses or contact details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Contact Information
            </h2>

            <p className="mb-4">
              For shipping-related queries, contact us at:
            </p>

            <div className="mt-4">
              <p>Deborah Foods and Spices</p>
              <p>No:12, Anjugam Nagar Main Road,</p>
              <p>Kolathur, Chennai - 600099.</p>
              <p>Tamil Nadu, India.</p>

              <p className="mt-3">
                Email: deborahfoodsandspices@gmail.com
              </p>

              <p>Phone: +91 8754059548</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}