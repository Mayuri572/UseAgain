import { Link } from "react-router-dom";
import { MdOutlineRecycling } from "react-icons/md";
import { FiGithub, FiTwitter, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-text-neutral text-white mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <MdOutlineRecycling className="text-accent text-3xl" />
              <span className="font-poppins font-bold text-xl">UseAgain</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hyperlocal circular marketplace. Buy, sell, swap & donate — keeping things in use, out of landfill.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-accent transition-colors" aria-label="Social link">
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <FooterSection title="Marketplace">
            {[["Browse Listings", "/"], ["Post an Item", "/add-product"], ["Swap Items", "/swap"], ["Reward Store", "/rewards"]].map(([label, to]) => (
              <FooterLink key={to} to={to}>{label}</FooterLink>
            ))}
          </FooterSection>

          <FooterSection title="Community">
            {[["Dashboard", "/dashboard"], ["My Profile", "/profile"], ["Cart", "/cart"], ["Wishlist", "/wishlist"]].map(([label, to]) => (
              <FooterLink key={to} to={to}>{label}</FooterLink>
            ))}
          </FooterSection>

          <FooterSection title="Impact">
            <p className="text-gray-400 text-sm">Every item reused saves CO₂. Track your impact in the Dashboard.</p>
            <div className="mt-3 space-y-1">
              <ImpactStat label="Items Traded" value="247+" />
              <ImpactStat label="CO₂ Saved" value="3.1 tonnes" />
              <ImpactStat label="Active Users" value="1,240" />
            </div>
          </FooterSection>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© 2024 UseAgain. Built for the circular economy.</p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with 🌱 for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, children }) {
  return (
    <div>
      <h3 className="font-poppins font-semibold text-sm uppercase tracking-wider text-gray-300 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="block text-gray-400 text-sm hover:text-accent transition-colors">
      {children}
    </Link>
  );
}

function ImpactStat({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-accent font-semibold">{value}</span>
    </div>
  );
}
