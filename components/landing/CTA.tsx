export default function CTA() {
  return (
    <section className="py-20 bg-gray-900 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Ship With Confidence?
      </h2>
      <p className="mb-8">
        Start shipping or track your delivery in seconds.
      </p>
      <div className="flex justify-center gap-4">
        <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-md font-semibold">
          Track Shipment
        </button>
        <button className="border border-white px-6 py-3 rounded-md">
          Get a Quote
        </button>
      </div>
    </section>
  );
}
