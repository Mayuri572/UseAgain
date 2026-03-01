import { useState, useEffect } from "react";

const QUOTES = [
  { text: "The greenest product is the one already made.", author: "Circular Economy Principle" },
  { text: "Every item you buy used saves new resources from being extracted.", author: "Ellen MacArthur Foundation" },
  { text: "Sharing is the new owning. Community is the new commerce.", author: "UseAgain Manifesto" },
  { text: "One person's surplus is another's treasure — and our planet's relief.", author: "UseAgain Community" },
  { text: "Small acts of reuse, multiplied by thousands, create enormous change.", author: "Green Economy Insight" },
];

export default function QuoteSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % QUOTES.length);
        setFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[current];

  return (
    <section className="bg-primary text-white py-10 px-4" aria-live="polite" aria-label="Rotating quotes">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="transition-all duration-400"
          style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(-8px)" : "translateY(0)" }}
        >
          <blockquote>
            <p className="font-poppins text-xl sm:text-2xl font-semibold leading-relaxed mb-3">
              "{quote.text}"
            </p>
            <footer className="text-accent text-sm font-medium">— {quote.author}</footer>
          </blockquote>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Quote navigation">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 400); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-accent w-6" : "bg-white/40"}`}
              role="tab"
              aria-selected={i === current}
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
