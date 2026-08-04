'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloating() {
  const whatsappUrl = "https://wa.me/918977969989?text=" + encodeURIComponent("Hello ANITHA DRESSES! I have an inquiry regarding your family fashion products.");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition duration-300 hover:scale-110 border-2 border-emerald-400 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      <span className="hidden sm:inline-block font-bold text-xs pr-1">
        WhatsApp Support
      </span>
    </a>
  );
}
