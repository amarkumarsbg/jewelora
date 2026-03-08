import { X } from "lucide-react";

const RING_SIZES = [
  { us: "5", uk: "J", indian: "49.5", diameter: "15.7mm" },
  { us: "6", uk: "L", indian: "51.9", diameter: "16.5mm" },
  { us: "7", uk: "N", indian: "54.0", diameter: "17.2mm" },
  { us: "8", uk: "P", indian: "56.1", diameter: "17.9mm" },
  { us: "9", uk: "R", indian: "58.3", diameter: "18.6mm" },
];

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex justify-between items-center">
          <h3 className="font-heading text-xl font-semibold">Size Guide</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-neutral-dark mb-2">Ring Sizes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-2">US</th>
                    <th className="text-left py-2">UK</th>
                    <th className="text-left py-2">Indian</th>
                    <th className="text-left py-2">Diameter</th>
                  </tr>
                </thead>
                <tbody>
                  {RING_SIZES.map((r) => (
                    <tr key={r.us} className="border-b border-black/5">
                      <td className="py-2">{r.us}</td>
                      <td>{r.uk}</td>
                      <td>{r.indian}</td>
                      <td>{r.diameter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-dark mb-2">Bangles & Bracelets</h4>
            <p className="text-neutral-mid text-sm">
              Most bangles are one-size. For adjustable bracelets, measure your wrist and add 1–2 cm for comfort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
