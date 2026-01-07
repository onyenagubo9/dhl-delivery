import { Package, Calculator, Building2 } from "lucide-react";

export default function ActionCards() {
  const cards = [
    {
      icon: Package,
      title: "Ship Now",
      text: "Send parcels locally or internationally with trusted logistics partners.",
    },
    {
      icon: Calculator,
      title: "Get a Quote",
      text: "Calculate delivery costs instantly with transparent pricing.",
    },
    {
      icon: Building2,
      title: "Business Solutions",
      text: "Logistics solutions tailored for growing businesses and enterprises.",
    },
  ];

  return (
    <section className="-mt-20 max-w-6xl mx-auto px-6 relative z-10">
      <div className="grid md:grid-cols-3 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {cards.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="p-8 flex gap-4 border-b md:border-b-0 md:border-r last:border-none hover:bg-gray-50 transition"
          >
            <Icon className="w-10 h-10 text-red-600 shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
