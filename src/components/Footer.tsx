import Link from "next/link";

const productLinks = [
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "Integrations" },
  { href: "#", label: "Changelog" },
];

const companyLinks = [
  { href: "#", label: "About" },
  { href: "#", label: "Blog" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Press" },
];

const supportLinks = [
  { href: "#", label: "Help Center" },
  { href: "#", label: "Community" },
  { href: "#", label: "Status" },
  { href: "#", label: "API Docs" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 mt-16">
      {/* Main Footer Content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-slate-200 mb-3">
              AfterClass
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The definitive third space for university learning. Bridging lectures and independent study.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AfterClass Inc. Built for academic excellence.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-all">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-all">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-all">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
