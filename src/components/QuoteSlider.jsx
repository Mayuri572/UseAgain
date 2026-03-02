import { useEffect, useMemo, useState } from "react";
import { MOCK_QUOTES } from "../mockData.js";

export default function QuoteSlider() {
  const [index, setIndex] = useState(0);
  const quote = MOCK_QUOTES[index];
  const intervalMs = useMemo(() => (quote?.text?.length > 120 ? 6000 : 4500), [quote]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOCK_QUOTES.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return (
    <section className="px-4 py-6 bg-bg-neutral" aria-live="polite">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-sm p-6 sm:p-7">
          <p className="text-lg sm:text-xl leading-relaxed text-gray-900 font-medium min-h-[80px]">
            “{quote.text}”
          </p>
          <p className="mt-2 text-sm text-gray-500">— {quote.author}</p>

          <div className="mt-4 flex items-center gap-2" role="tablist" aria-label="Quote indicators">
            {MOCK_QUOTES.map((q, i) => (
              <button
                key={`${q.author}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
                aria-label={`Show quote ${i + 1}`}
                aria-selected={i === index}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
