import { CheckCircle2, Circle, Truck, Package, MapPin, Home } from "lucide-react";

const statusIcons = {
  "Order Confirmed": Package,
  "Processing": Package,
  "Packed": Truck,
  "In Transit": MapPin,
  "Delivered": Home
};

export default function TrackingMap({ timeline, estimatedDelivery }) {
  function formatDate(isoString) {
    if (!isoString) return null;
    return new Date(isoString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
  }

  const daysUntilDelivery = Math.ceil(
    (new Date(estimatedDelivery) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="w-full">
      {/* Main Timeline */}
      <div className="relative">
        {/* Connector Line */}
        <div className="absolute left-[23px] top-12 h-[calc(100%-48px)] w-1 bg-gradient-to-b from-plum to-ink/10" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {timeline.map((item, idx) => {
            const Icon = statusIcons[item.status] || Circle;
            const isCompleted = item.completed;
            const isCurrent = idx === timeline.findIndex(t => !t.completed && t !== item) ? false : (idx === 0 ? true : false);

            return (
              <div key={idx} className="relative flex gap-4">
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-sage text-white"
                        : idx === 0
                        ? "bg-plum text-white ring-4 ring-plum/20"
                        : "bg-ink/10 text-ink-soft"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                </div>

                <div className="flex-1 pt-1">
                  <p className={`font-semibold ${isCompleted ? "text-sage" : "text-ink"}`}>
                    {item.status}
                  </p>
                  {item.date && (
                    <p className="text-xs text-ink-soft">
                      {formatDate(item.date)}
                    </p>
                  )}
                  {!item.date && item.status === "Delivered" && daysUntilDelivery > 0 && (
                    <p className="text-xs text-plum font-medium">
                      Expected in {daysUntilDelivery} day{daysUntilDelivery !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracking Info Box */}
      <div className="mt-8 rounded-xl bg-gradient-to-r from-plum/5 to-sage/5 p-4 border border-plum/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
          Expected Delivery
        </p>
        <p className="font-display text-lg font-semibold text-ink">
          {formatDate(estimatedDelivery)}
        </p>
        {daysUntilDelivery > 0 && (
          <p className="text-xs text-ink-soft mt-1">
            In approximately {daysUntilDelivery} day{daysUntilDelivery !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
