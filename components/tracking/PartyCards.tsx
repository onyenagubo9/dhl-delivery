import { User, MapPin, Phone, Mail } from "lucide-react";

type Party = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export default function PartyCards({
  sender,
  receiver,
}: {
  sender: Party;
  receiver: Party;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card title="Sender" data={sender} />
      <Card title="Receiver" data={receiver} />
    </div>
  );
}

function Card({ title, data }: { title: string; data: Party }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>

      <Info icon={User} value={data.name} />
      <Info icon={Phone} value={data.phone} />
      <Info icon={Mail} value={data.email} />
      <Info icon={MapPin} value={data.address} />
    </div>
  );
}

function Info({
  icon: Icon,
  value,
}: {
  icon: any;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-gray-600 mb-2">
      <Icon className="w-4 h-4 mt-0.5 text-gray-400" />
      <span>{value}</span>
    </div>
  );
}
