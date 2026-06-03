import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import Menu from "./icons/Menu";
import Close from "./icons/Close";
import type { Page } from "../../types/layout";

interface Props {
  logoSrc: string;
  logoAlt: string;
  paginas: Page[];
}

const BG =
  "bg-linear-to-r from-black/80 from-5% to-[#02444a]/80 backdrop-blur-sm";

const DROPDOWN_CLS =
  "bg-[linear-gradient(135deg,rgba(5,18,20,0.88)_0%,rgba(2,68,74,0.82)_100%)] backdrop-blur-sm border border-white/8";

export default function NavbarClient({ logoSrc, logoAlt, paginas }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [masOpen, setMasOpen] = useState(false);
  const [overflowStart, setOverflowStart] = useState(paginas.length);
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [masButtonWidth, setMasButtonWidth] = useState(90);

  const navListRef = useRef<HTMLUListElement>(null);
  const measureRefs = useRef<(HTMLLIElement | null)[]>([]);
  const masMeasureRef = useRef<HTMLLIElement>(null);
  const masRef = useRef<HTMLLIElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure natural item widths from the hidden off-screen container.
  // useLayoutEffect runs before paint so there's no flash of wrong state.
  useLayoutEffect(() => {
    const widths = measureRefs.current
      .slice(0, paginas.length)
      .map((el) => el?.getBoundingClientRect().width ?? 0);
    setItemWidths(widths);
    setMasButtonWidth(
      masMeasureRef.current?.getBoundingClientRect().width ?? 90,
    );
    // paginas.length is the only dependency that would change these widths
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginas.length]);

  // Recalculate which items fit whenever the container resizes or widths are ready
  const calculateOverflow = useCallback(() => {
    const container = navListRef.current;
    if (!container || itemWidths.length === 0) return;

    // Small safety margin: if an item is within MARGIN px of the edge, treat it as not fitting.
    // This prevents items from visually clipping before "Más" kicks in.
    const MARGIN = 12;
    const containerWidth = container.getBoundingClientRect().width - MARGIN;
    const total = itemWidths.reduce((a, b) => a + b, 0);

    // All items fit without a "Más" button
    if (total <= containerWidth) {
      setOverflowStart(paginas.length);
      return;
    }

    // Find the largest prefix of items that fits alongside the "Más" button.
    // For each candidate position i, we need:
    //   sum(widths[0..i-1]) + masButtonWidth <= containerWidth
    let used = 0;
    for (let i = 0; i < paginas.length; i++) {
      const w = itemWidths[i] ?? 0;
      if (used + w + masButtonWidth <= containerWidth) {
        used += w;
      } else {
        setOverflowStart(i);
        return;
      }
    }
    setOverflowStart(paginas.length);
  }, [itemWidths, masButtonWidth, paginas.length]);

  useEffect(() => {
    const container = navListRef.current;
    if (!container) return;
    const ro = new ResizeObserver(calculateOverflow);
    ro.observe(container);
    calculateOverflow();
    return () => ro.disconnect();
  }, [calculateOverflow]);

  // Close "Más" when clicking outside
  useEffect(() => {
    if (!masOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (masRef.current && !masRef.current.contains(e.target as Node)) {
        setMasOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [masOpen]);

  const hasOverflow = overflowStart < paginas.length;
  const overflowPages = paginas.slice(overflowStart);
  const hasBackground = scrolled || mobileOpen || masOpen;

  const linkClass =
    "block font-semibold text-base lg:text-lg py-2 px-2 whitespace-nowrap transition-colors duration-200 hover:text-secondary relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-secondary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-white animate-slide-in-top">
      {/*
        Shaped background layer — positioned so it has headroom above (topExt=18px)
        and below (botExt=22px) the navbar content row to accommodate the corner
        decorations without being clipped.  Kept on -z-10 so dropdown menus are
        never obscured by it.
      */}
      <div
        className={`absolute inset-0 -z-10 rounded-b-3xl transition-opacity duration-300 ${BG}`}
        style={{
          filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))",
          opacity: hasBackground ? 1 : 0,
        }}
      />
      {/*
        Hidden measurement list — rendered off-screen with natural (non-stretched) widths.
        Items here use the same classes as the real nav so widths match exactly.
        "fixed" + "-top-2499.75" keeps it out of flow and off-screen without causing scrollbars.
      */}
      <ul
        aria-hidden="true"
        className="fixed -top-2499.75 left-0 flex items-center pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        {paginas.map((pagina, i) => (
          <li
            key={pagina.href}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
          >
            <a href={pagina.href} className={linkClass}>
              {pagina.nombre}
            </a>
          </li>
        ))}
        <li ref={masMeasureRef}>
          <button className="flex items-center gap-1 font-semibold text-base lg:text-lg py-2 px-2 whitespace-nowrap">
            Más
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </li>
      </ul>

      <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex items-center">
        {/* Logo */}
        <a href="/" className="shrink-0 mr-4">
          <img
            src={logoSrc}
            alt={logoAlt}
            width={200}
            height={75}
            className="h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop nav */}
        <ul
          ref={navListRef}
          className="hidden md:flex flex-1 items-center justify-evenly"
        >
          {paginas.map((pagina, i) => (
            <li
              key={pagina.href}
              className={`relative group ${i >= overflowStart ? "hidden" : ""}`}
            >
              <a href={pagina.href} className={linkClass}>
                {pagina.nombre}
              </a>
              {pagina.subpaginas && pagina.subpaginas.length > 0 && (
                <ul
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 text-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-50 z-50 overflow-hidden ${DROPDOWN_CLS}`}
                >
                  {pagina.subpaginas.map((sub) => (
                    <li
                      key={sub.href}
                      className="hover:bg-white/10 transition-colors duration-150"
                    >
                      <a
                        href={sub.href}
                        className="block px-5 py-3 text-base font-medium text-center text-white/90 hover:text-white"
                      >
                        {sub.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* "Más" overflow dropdown */}
          {hasOverflow && (
            <li ref={masRef} className="relative">
              <button
                onClick={() => setMasOpen((o) => !o)}
                className="flex items-center gap-1 font-semibold text-base lg:text-lg py-2 px-2 whitespace-nowrap transition-colors duration-200 hover:text-secondary"
              >
                Más
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${masOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {masOpen && (
                <ul
                  className={`absolute right-0 top-full mt-2 text-white rounded-2xl shadow-2xl min-w-50 z-50 overflow-hidden ${DROPDOWN_CLS}`}
                >
                  {overflowPages.map((pagina) => (
                    <li key={pagina.href}>
                      <a
                        href={pagina.href}
                        onClick={() => setMasOpen(false)}
                        className="block px-5 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-150"
                      >
                        {pagina.nombre}
                      </a>
                      {pagina.subpaginas && pagina.subpaginas.length > 0 && (
                        <ul className="border-t border-white/10 bg-black/20">
                          {pagina.subpaginas.map((sub) => (
                            <li
                              key={sub.href}
                              className="hover:bg-white/10 transition-colors duration-150"
                            >
                              <a
                                href={sub.href}
                                onClick={() => setMasOpen(false)}
                                className="block px-8 py-2.5 text-sm font-medium text-white/75 hover:text-white"
                              >
                                {sub.nombre}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label={
            mobileOpen
              ? "Cerrar menú de navegación"
              : "Abrir menú de navegación"
          }
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <Close className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown — uses the same BG as the navbar */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/20">
          <ul className="py-2">
            {paginas.map((pagina) => (
              <li key={pagina.href}>
                <a
                  href={pagina.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3 font-semibold text-lg hover:bg-white/10 active:bg-white/20 transition-colors"
                >
                  {pagina.nombre}
                </a>
                {pagina.subpaginas && pagina.subpaginas.length > 0 && (
                  <ul className="bg-black/20">
                    {pagina.subpaginas.map((sub) => (
                      <li key={sub.href}>
                        <a
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-10 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {sub.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
