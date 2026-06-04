import { getTranslation, type Language } from "@/lib/translations";

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = getTranslation(language);

  return (
    <footer className="w-full bg-[#01443D] text-white py-8 md:py-10 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h3 className="font-display text-2xl md:text-3xl">{t.footerContact}</h3>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 font-body text-sm md:text-base">
          {/* Phone */}
          <a
            href="tel:0335574657"
            className="inline-flex items-center gap-2 hover:text-emerald-200 transition-colors"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6.62 10.79a15.53 15.53 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.02l-2.2 2.21z" />
            </svg>
            <span>
              {t.footerPhone}: <span dir="ltr">0335 574 657</span>
            </span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/pthao207203/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-emerald-200 transition-colors"
          >
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
            </svg>
            <span>{t.footerFacebook}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
