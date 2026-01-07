export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold mb-2">DHL Delivery</h3>
          <p>Fast, secure worldwide logistics solutions.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Services</h4>
          <p>Express</p>
          <p>Freight</p>
          <p>Warehousing</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Company</h4>
          <p>About</p>
          <p>Careers</p>
          <p>Contact</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Legal</h4>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
