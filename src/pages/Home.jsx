import { Link, useNavigate } from "react-router-dom";
import QuoteSlider from "../components/QuoteSlider.jsx";
import { MOCK_CATEGORIES, MOCK_IMPACT_STATS } from "../mockData.js";
import { HiSparkles, HiGlobeAlt, HiCollection } from "react-icons/hi";
import { usePoints } from "../context/PointsContext.jsx";
import { motion } from "framer-motion";
import { ShoppingBag, RefreshCw, Heart } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { points } = usePoints();

  return (
    <main className="bg-bg-neutral text-text-neutral">
      <section className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white py-12 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm tracking-widest text-white/70 uppercase mb-2">
              Buy • Sell • Swap • Donate
            </p>
            <h1 className="font-poppins font-bold text-5xl sm:text-6xl leading-tight bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
              UseAgain
            </h1>
            <p className="mt-3 text-white/85 text-base sm:text-lg max-w-2xl">
              A hyperlocal circular marketplace for campuses and neighborhoods. Reuse more, waste less, and keep value in the community.
            </p>
            <div className="mt-6">
              <Link to="/product" className="btn-primary inline-flex items-center">
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteSlider />

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins text-xl font-semibold text-gray-900">Browse by Category</h2>
            <Link to="/product" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {MOCK_CATEGORIES.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => navigate(`/product/${encodeURIComponent(category.name)}`)}
                className="group rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                aria-label={`Browse ${category.name} listings`}
              >
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                <div className="p-3 text-left">
                  <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.count} items</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={ctaContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <ActionCard
              title="Explore Products"
              description="Browse reusable items near you."
              buttonLabel="Explore Products"
              to="/product"
              accent="shadow-[0_8px_24px_rgba(20,184,166,0.16)] hover:shadow-[0_16px_38px_rgba(20,184,166,0.22)]"
              Icon={ShoppingBag}
              iconClassName="text-teal-600"
            />
            <ActionCard
              title="Swap With Campus"
              description="Exchange items within 5 km."
              buttonLabel="Start Swapping"
              to="/swap"
              accent="shadow-[0_8px_24px_rgba(16,185,129,0.16)] hover:shadow-[0_16px_38px_rgba(16,185,129,0.22)]"
              Icon={RefreshCw}
              iconClassName="text-emerald-600"
            />
            <ActionCard
              title="Donate & Earn Points"
              description="Give items and earn green points."
              buttonLabel="Donate Now"
              to="/donate"
              accent="shadow-[0_8px_24px_rgba(132,204,22,0.16)] hover:shadow-[0_16px_38px_rgba(132,204,22,0.22)]"
              Icon={Heart}
              iconClassName="text-lime-600"
            />
          </motion.div>
        </div>
      </section>

      <section className="pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={<HiGlobeAlt className="w-5 h-5 text-blue-600" />} label="CO₂ Saved" value={`${MOCK_IMPACT_STATS.co2Saved.toLocaleString()} kg`} />
            <StatCard icon={<HiCollection className="w-5 h-5 text-emerald-600" />} label="Items Reused" value={MOCK_IMPACT_STATS.itemsTraded.toLocaleString()} />
            <StatCard icon={<HiSparkles className="w-5 h-5 text-amber-500" />} label="Green Points Earned" value={points.toLocaleString()} />
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <article className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <p className="mt-2 font-poppins text-xl font-semibold text-gray-900">{value}</p>
    </article>
  );
}

const ctaContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const ctaItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ActionCard({ title, description, buttonLabel, to, accent, Icon, iconClassName }) {
  return (
    <motion.article
      variants={ctaItemVariants}
      className={`relative overflow-hidden rounded-3xl p-8 min-h-[320px] bg-gradient-to-br from-teal-50 via-emerald-50 to-white border border-teal-100/70 shadow-lg hover:scale-105 transition-all duration-300 ${accent}`}
    >
      <div className="pointer-events-none absolute -top-8 -right-8 w-36 h-36 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-emerald-200/30 blur-2xl" />

      <div className="relative z-10 flex h-full flex-col items-center text-center">
        <div className="mb-6 rounded-2xl bg-white/85 p-4 shadow-sm">
          <Icon className={`w-14 h-14 ${iconClassName}`} />
        </div>

        <h3 className="font-poppins text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-base text-gray-600 mb-8">{description}</p>

        <Link
          to={to}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2.5 font-semibold shadow hover:bg-primary-dark hover:-translate-y-0.5 transition-all duration-200"
        >
          {buttonLabel}
        </Link>
      </div>
    </motion.article>
  );
}
