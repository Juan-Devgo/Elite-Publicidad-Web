import { useState, useRef, useEffect } from "react";
import WhatsAppIcon from "../icons/WhatsApp.tsx";
import CloseIcon from "../icons/Close.tsx";
import SendIcon from "../icons/Send.tsx";
interface Props {
  telefono: string;
  fotoPerfil?: { src: string; alt: string };
  mensaje?: string;
}

export default function WhatsAppButton({
  telefono,
  fotoPerfil,
  mensaje = "¡Hola! Soy {nombre} y me gustaría obtener más información sobre sus servicios de publicidad.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const previewMsg = mensaje.replace("{nombre}", nombre.trim() || "tú");

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const send = () => {
    const name = nombre.trim() || "Cliente";
    const msg = mensaje.replace("{nombre}", name);
    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-20 right-6 z-40">
      {/* Card — anchored above button */}
      <div
        className={`absolute bottom-full right-0 mb-3 w-80 sm:w-96 transition-all duration-300 ${open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop for mobile */}
        <div
          className={`fixed inset-0 bg-black/50 sm:hidden -z-10 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
        />

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
            <div
              className={`${fotoPerfil ? "bg-black" : "bg-[#25D366]"} rounded-full p-1.5 shrink-0`}
            >
              {fotoPerfil ? (
                <img
                  src={fotoPerfil.src}
                  alt={fotoPerfil.alt}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <WhatsAppIcon className="w-5 h-5 fill-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">
                Élite Publicidad
              </p>
              <p className="text-white/70 text-xs">
                Típicamente responde en minutos
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 shrink-0"
              aria-label="Cerrar chat"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="bg-[#ECE5DD] px-4 pt-4 pb-2 min-h-25">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm inline-block max-w-[88%]">
              <p className="text-gray-800 text-sm leading-relaxed wrap-break-word">
                {previewMsg}
              </p>
              <p className="text-gray-400 text-[10px] text-right mt-1">
                Ahora ✓✓
              </p>
            </div>
          </div>

          {/* Input area */}
          <div className="bg-[#F0F0F0] px-3 py-3 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-white border-0 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow-sm min-w-0"
              placeholder="Escribe tu nombre..."
              maxLength={50}
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button
              onClick={send}
              className="bg-[#075E54] hover:bg-[#064d45] active:scale-95 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shrink-0 shadow"
              aria-label="Enviar mensaje"
            >
              <SendIcon className="w-5 h-5 fill-white translate-x-px" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer bg-[#25D366] hover:bg-[#1DA851] active:scale-95 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
        style={{
          animationIterationCount: "infinite",
          animationDelay: "0ms",
          animationDuration: "3000ms",
        }}
        aria-label="Abrir chat de WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 fill-current" />
      </button>
    </div>
  );
}
