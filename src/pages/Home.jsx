import React from 'react';
import { Link } from 'react-router-dom';
import { commonStyles, colors } from '../utils/theme';

const testimonials = [
  { name: "Amina Wanjiru", unit: "B5", text: "Living at Fairview has been wonderful. The water supply never fails and the security is top-notch.", stars: 5 },
  { name: "Brian Otieno", unit: "D12", text: "Clean, modern apartments at a very fair price. The management team is responsive and professional.", stars: 5 },
  { name: "Cynthia Mwangi", unit: "A3", text: "Love the convenience store and water refill point. Everything I need is right here.", stars: 4 },
];

const amenities = [
  { icon: "💧", title: "Reliable Water", desc: "24/7 water supply with backup tanks" },
  { icon: "📶", title: "Internet Coverage", desc: "Strong network coverage throughout" },
  { icon: "🔒", title: "Security", desc: "24-hour security personnel & CCTV" },
  { icon: "🛒", title: "On-site Shop", desc: "Convenience store on premises" },
  { icon: "🪣", title: "Water Refill", desc: "Affordable water refilling station" },
  { icon: "🚗", title: "Parking", desc: "Safe compound parking available" },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#4A1019] via-[#6B1B2A] to-[#2d1b1b] py-20 px-6 text-center text-white">
        <div className="text-xs text-[#C0C0C8] tracking-[0.3em] mb-2 uppercase">Nairobi, Kenya</div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">FAIRVIEW APARTMENTS</h1>
        <div className="w-16 h-1 bg-[#C0C0C8] mx-auto mb-6" />
        <p className="text-xl text-[#C0C0C8] mb-8 font-light italic">Premium Living. Comfort. Community.</p>
        <p className="text-[#d1b3b3] max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience modern apartment living in Nairobi. 90 units across 6 floors with world-class amenities and unmatched security.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/booking" className={commonStyles.buttonPrimary}>Book a Room →</Link>
          <Link to="/rooms" className="border-2 border-[#C0C0C8] text-[#C0C0C8] px-6 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#6B1B2A] transition-all">View Rooms</Link>
        </div>
        
        <div className="flex flex-wrap gap-12 justify-center mt-16">
          {[["90","Total Units"],["6","Floors"],["KES 6.5K","From/mo"]].map(([v,l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-bold text-[#C0C0C8]">{v}</div>
              <div className="text-xs text-[#d1b3b3] mt-1 uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#FEF9C3] border-b-2 border-[#FCD34D] py-3 px-6 flex items-center gap-3">
        <span className="text-xl">📢</span>
        <span className="text-sm text-[#92400E] font-medium">
          Rent is due before the 10th of every month. Water cost: KES 400/unit. Vacating tenants must notify management at the start of the month.
        </span>
      </div>

      {/* Amenities */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className={commonStyles.sectionTitle}>Amenities & Facilities</h2>
        <p className={commonStyles.sectionSub}>Everything you need for a comfortable life</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map(a => (
            <div key={a.title} className={`${commonStyles.card} text-center hover:shadow-md transition-shadow`}>
              <div className="text-4xl mb-4">{a.icon}</div>
              <div className="font-bold text-[#6B1B2A] mb-2">{a.title}</div>
              <div className="text-sm text-[#6B7280]">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-[#F9FAFB] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className={commonStyles.sectionTitle}>Pricing Plans</h2>
          <p className={commonStyles.sectionSub}>Transparent, affordable pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white border-2 border-[#6B1B2A] rounded-2xl p-8 text-center shadow-lg transform hover:scale-[1.02] transition-all">
              <div className="bg-[#6B1B2A] text-white px-4 py-1 rounded-full text-xs font-bold inline-block mb-4 uppercase tracking-widest">Corner Units</div>
              <div className="text-5xl font-black text-[#6B1B2A] mb-2">KES 6,500</div>
              <div className="text-[#6B7280] text-sm mb-4">per month</div>
              <div className="text-xs text-[#6B7280] border-t border-gray-100 pt-4">3 corner units per floor · Units 1, 8 & 15</div>
            </div>
            <div className="bg-white border-2 border-[#6B7280] rounded-2xl p-8 text-center shadow-lg transform hover:scale-[1.02] transition-all">
              <div className="bg-[#374151] text-white px-4 py-1 rounded-full text-xs font-bold inline-block mb-4 uppercase tracking-widest">Standard Units</div>
              <div className="text-5xl font-black text-[#374151] mb-2">KES 7,000</div>
              <div className="text-[#6B7280] text-sm mb-4">per month</div>
              <div className="text-xs text-[#6B7280] border-t border-gray-100 pt-4">12 standard units per floor</div>
            </div>
          </div>
          
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-8 shadow-sm">
            <h3 className="font-bold text-[#991B1B] mb-4 flex items-center gap-2">
              <span className="text-lg text-[#991B1B]">📋</span> Apartment Rules
            </h3>
            <ul className="space-y-3 text-[#7F1D1D] text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#FCA5A5] mt-1">•</span>
                <span>Rent must be paid before the <strong className="font-bold">10th of every month</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FCA5A5] mt-1">•</span>
                <span>Tenants planning to vacate must submit a vacation notice at the <strong className="font-bold">beginning of the month</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FCA5A5] mt-1">•</span>
                <span>Water bill: <strong className="font-bold">KES 400 per unit</strong> per month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FCA5A5] mt-1">•</span>
                <span>Keep common areas clean and respect other tenants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FCA5A5] mt-1">•</span>
                <span>No loud noise after 10 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className={commonStyles.sectionTitle}>Tenant Reviews</h2>
        <p className={commonStyles.sectionSub}>What our residents say</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className={commonStyles.card}>
              <div className="text-[#FBBF24] text-xl mb-3">{"★".repeat(t.stars)}</div>
              <p className="text-[#6B7280] text-sm leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="font-bold text-sm">{t.name}</div>
              <div className="text-xs text-[#6B7280]">Unit {t.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Contact */}
      <div className="bg-[#4A1019] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
          <p className="text-[#C0C0C8] mb-10">Fairview Apartments, Nairobi, Kenya</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[["📞","Phone","0712 345 678"],["📧","Email","info@fairviewapts.co.ke"],["📍","Location","Nairobi, Kenya"]].map(([i,l,v]) => (
              <div key={l} className="text-center">
                <div className="text-3xl mb-2">{i}</div>
                <div className="text-xs text-[#C0C0C8] uppercase tracking-widest mb-1">{l}</div>
                <div className="font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <a 
            href="https://wa.me/254712345678" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#128C7E] transition-all transform hover:scale-105"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
