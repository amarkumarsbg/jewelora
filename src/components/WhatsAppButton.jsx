import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919129987687"; // Update with your business WhatsApp number (with country code, no +)
const MESSAGE = "Hi! I'd like to know more about your jewelry collection.";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
