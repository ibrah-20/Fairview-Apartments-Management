import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppFAB = () => {
  return (
    <a
      href="https://wa.me/254712345678"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
    </a>
  );
};

export default WhatsAppFAB;
