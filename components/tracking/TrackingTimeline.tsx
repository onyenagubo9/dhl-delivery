type TimelineItem = {
  status: string;
  time?: any;
};

export default function TrackingTimeline({
  history,
}: {
  history: TimelineItem[];
}) {
  return (
    <div className="bg-white rounded-xl p-6 border shadow">
      <h2 className="font-semibold mb-4">
        Tracking Timeline
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No updates yet
        </p>
      ) : (
        <ul className="space-y-3">
          {history.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-2 h-2 mt-2 bg-yellow-500 rounded-full" />
              <div>
                <p className="font-medium capitalize">
                  {item.status.replace("_", " ")}
                </p>
                {item.time && (
                  <p className="text-xs text-gray-500">
                    {new Date(
                      item.time.seconds * 1000
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
