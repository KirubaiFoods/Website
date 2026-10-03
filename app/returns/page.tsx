export default function ReturnsPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 md:px-8">
      <div className="max-w-6xl ml-3 md:ml-12 lg:ml-20 mr-3 md:mr-6">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f4d3a] mb-4">
            Return & Refund Policy
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
              At Kirubai Masala, we strive to provide the highest quality
              products and customer satisfaction. If you are not fully satisfied
              with your purchase, please review our return and refund policy below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Eligibility for Returns
            </h2>

            <p className="mb-4">
              Returns are accepted only for damaged, defective, or incorrect
              products received. To be eligible for a return:
            </p>

            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>The product must be unused and unopened.</li>
              <li>
                The return request must be raised within 48 hours of delivery.
              </li>
              <li>
                Proof of damage such as photos or videos may be required.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Non-Returnable Items
            </h2>

            <p className="mb-4">
              Due to the nature of food products, we do not accept returns for:
            </p>

            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Opened or used products</li>
              <li>Products damaged due to improper storage after delivery</li>
              <li>Orders placed incorrectly by the customer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Refund Process
            </h2>

            <p className="mb-4">
              Once your return request is approved, refunds will be processed
              to the original payment method within 5–7 business days.
            </p>

            <p className="mb-4">
              In certain cases, we may provide a replacement product instead
              of a refund depending on product availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Cancellation Policy
            </h2>

            <p className="mb-4">
              Once an order is placed, it cannot be canceled or modified. Please ensure all details are correct before completing your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-4">
              Contact for Returns
            </h2>

            <p className="mb-4">
              For return or refund related enquiries, please contact us:
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