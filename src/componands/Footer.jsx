import { NavLink } from "react-router-dom";

const helpLinks = [
  { label: "Order status", path: "/order-status" },
  { label: "Return Portal", path: "/return-portal" },
  { label: "Help", path: "/help" },
  { label: "Orders", path: "/orders" },
  { label: "Shipping and delivery", path: "/shipping-delivery" },
  { label: "Returns", path: "/returns" },
  { label: "Payment options", path: "/payment-options" },
  { label: "Members and Supporters' Club", path: "/supporters-club" },
  { label: "Contact us", path: "/contact" },
  { label: "Store Finder", path: "/store-finder" },
];

const socialLinks = [
  { label: "Facebook", path: "https://facebook.com" },
  { label: "Twitter", path: "https://twitter.com" },
  { label: "Spotify", path: "https://spotify.com" },
  { label: "Youtube", path: "https://youtube.com" },
  { label: "Instagram FC Barcelona", path: "https://instagram.com/fcbarcelona" },
  { label: "Instagram Barça Store", path: "https://instagram.com/barcastore" },
  { label: "OneFootball", path: "https://onefootball.com" },
  { label: "TikTok", path: "https://tiktok.com" },
];

export default function Footer() {
  return (
    <footer className="bg-[#14172b] w-full overflow-hidden pt-8 pb-16">
      {/* Full-width FC BARCELONA title */}
      <div className="w-full overflow-hidden">
        <h1
          className="
  font-oswald font-extrabold uppercase select-none
  text-[4vw] md:text-[16vw] leading-none tracking-tight
  text-transparent bg-clip-text 
  bg-gradient-to-r from-[#ffffff] via-[#ffffff] to-[#ffffff]
  md:w-[100%]
  text-left px-4 md:px-8
  transition-all duration-900 
  hover:from-[#e4b405] hover:via-[#f60469] hover:to-[#3687ea]
"
        >
       &nbsp;FC BARCELONA
        </h1>
      </div>

      {/* Footer grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mt-10 px-6">
        {/* Find Out the Latest */}
        <div>
          <h2 className="text-white font-bold mb-4 text-lg">
            FIND OUT THE LATEST
          </h2>
          <p className="text-gray-400 text-sm mb-2">Email</p>
          <input
            type="text"
            placeholder="Enter your email"
            className="bg-transparent border-b border-gray-600 w-full outline-none text-white pb-1 focus:border-white"
          />
        </div>

        {/* Help & Information */}
        <div>
          <h2 className="text-white font-bold mb-4 text-lg">
            HELP & INFORMATION
          </h2>
          <ul>
            {helpLinks.map((link) => (
              <li key={link.path} className="mb-2">
                <NavLink
                  to={link.path}
                  className="text-gray-300 text-base hover:text-white transition"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-white font-bold mb-4 text-lg">SOCIAL MEDIA</h2>
          <ul>
            {socialLinks.map((link) => (
              <li key={link.label} className="mb-2">
                <a
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-base hover:text-white transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy and Use */}
        <div>
          <h2 className="text-white font-bold mb-4 text-lg">PRIVACY AND USE</h2>
          <ul>
            <li className="text-gray-300 mb-2">Privacy policy</li>
            <li className="text-gray-300 mb-2">Purchase conditions</li>
            <li className="text-gray-300 mb-2">Cookie policy</li>
            <li className="text-gray-300 mb-2">Accessibility</li>
            <li className="text-gray-300 mb-2">Sitemap</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}