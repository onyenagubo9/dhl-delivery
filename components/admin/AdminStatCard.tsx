import { ReactNode } from "react";

export default function AdminStatCard({
  title,
  value,
  icon,
  variant,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  variant: "orders" | "customers" | "riders";
}) {
  const styles = {
    orders: {
      bg: "bg-gradient-to-br from-red-600 to-red-500",
      accent: "bg-red-700",
      text: "text-white",
      iconBg: "bg-white/20",
    },
    customers: {
      bg: "bg-gradient-to-br from-yellow-400 to-yellow-300",
      accent: "bg-yellow-500",
      text: "text-gray-900",
      iconBg: "bg-black/10",
    },
    riders: {
      bg: "bg-gradient-to-br from-gray-900 to-gray-800",
      accent: "bg-gray-700",
      text: "text-white",
      iconBg: "bg-white/10",
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-xl ${styles.bg} ${styles.text}`}
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${styles.accent}`}
      />

      <div className="flex items-center justify-between">
        {/* Text */}
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-4xl font-extrabold mt-2">
            {value}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${styles.iconBg}`}
        >
          <div className="w-8 h-8 opacity-80">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
