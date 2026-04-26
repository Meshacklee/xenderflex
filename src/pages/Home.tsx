import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Shield, Zap, Globe, Package, ArrowRight } from 'lucide-react';

export function Home() {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=2000" 
            alt="Logistics center" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-normal leading-tight mb-6">
              Complexity Conquered
            </h1>
            <p className="text-lg font-light leading-relaxed mb-4 max-w-sm">
              Xendflex's Parcel TMS platform makes it easy for shippers to control costs, while optimizing capacity, carbon, and their customers' delivery experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/contact" className="bg-[#fbb03b] hover:bg-[#e89e2c] text-black font-bold h-12 px-8 flex items-center justify-center transition-colors">
                GET STARTED
              </Link>
            </div>
            <form onSubmit={handleTrack} className="flex gap-2 max-w-md mt-12">
              <Input
                placeholder="TRACK YOUR SHIPMENT ID"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-10 rounded-none focus-visible:ring-1 focus-visible:ring-white"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <Button type="submit" className="bg-[#fbb03b] hover:bg-[#e89e2c] text-black font-bold px-8 rounded-none h-10">
                GO
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Are You Struggling */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=800" 
              alt="Package Tracking Diagram" 
              className="w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div className="text-[#634a92] font-bold text-[10px] uppercase tracking-[0.2em]">The New B2C Environment</div>
            <h2 className="text-4xl text-slate-800 font-light leading-[1.1]">
              Are You Struggling to Control Parcel Shipping Costs and Keep Your Delivery Promises? Then You Need More Than Simple Label Printing.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gone are the days of relying on a single parcel carrier to handle all your deliveries. Higher shipping costs, omnichannel fulfillment, and customers demand for faster, flexible, and free delivery options are making shippers diversify their carrier service offering. But deciding how, when, and where to use those carrier services has become increasingly complex.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Finally, there is a way to automate intelligent decision-making throughout your fulfillment processes: Xendflex Parcel TMS.
            </p>
            <Link to="/contact" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#634a92] hover:opacity-70 transition-opacity">
              Learn More About Xendflex Solutions <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Complexity Simplified */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="text-[#634a92] font-bold text-[10px] uppercase tracking-[0.2em]">Complexity Simplified</div>
            <h2 className="text-4xl text-slate-800 font-light leading-[1.1]">
              Xendflex Parcel TMS Adds a Data-driven Layer of Intelligence to Your Shipping Processes
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Sure, legacy shipping systems do a good job weighing, rating and label printing. But with costs and complexity increasing that isn’t enough anymore. Xendflex’s Parcel TMS platform enables you to diversify your carrier network and automate cost-effective decision-making in eCommerce storefronts, order allocation, fulfillment, and, of course, shipping and returns.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Best of all, Xendflex’s no-code wizards enable managers to configure and apply instructions to orders to reduce cost and waste, while optimizing capacity and customer delivery experiences. Use Xendflex instructions to run “what if” simulations against historical shipping data. And then easily re-configure instructions to adapt your operations to changing business conditions. No more costly programming and long project timelines.
            </p>
            <Link to="/contact" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#634a92] hover:opacity-70 transition-opacity">
              Learn More About the Xendflex Platform <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800" 
              alt="Parcel TMS Diagram" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Section 3: How Xendflex Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="text-[#634a92] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Control Costs, Capacity, Carbon, and Customers Delivery Experiences</div>
            <h2 className="text-4xl text-slate-800 font-light">How Xendflex Works for You</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Diversified Carrier Network", desc: "With eCommerce still in its early growth stage (only 19% of retail), parcel volumes are expected to double in the next two years. That means you need a more resilient carrier network to reduce the risk of delivery disruptions. Our powerful optimization engine makes it easy to manage our extensive network of final-mile carriers." },
              { title: "Superfast Carrier Rating", desc: "When you are quoting delivery costs in shopping carts, optimizing plans, or running simulation models, you don't have time to \"ping\" carrier rating APIs. They are too slow and unreliable, and companies are starting to levy surcharges for overuse. Xendflex Parcel TMS features an onboard rating engine that will accurately calculate over 20,000 rates per second." },
              { title: "Optimized Carrier Selection", desc: "Xendflex enables you to configure instructions to simplify complex carrier service selection processes based not only on carrier rates, but also on transit time, shipment attributes (SKU size, fragility, hazmat, order value, etc.), carrier performance (on-time delivery, damage, etc.), DIM factors, customer preferences, and more." },
              { title: "Carrier Contract Compliance", desc: "The gap between expected shipping costs and actual invoice costs is widening. That's because rating is becoming increasingly dynamic and complex with incentive tiers, surcharges, and daily pickup limits. Xendflex monitors shipping activity in real time and automatically controls routing to alternative carrier services based on your primary carrier commitments." },
              { title: "Optimize Cartonization", desc: "Unexpected dimensional weight adjustments on carrier invoices are eating into shippers' margins. Xendflex automates transportation cost-effective packing by applying cartonization algorithms and rules to reduce dimensional fees, waste, corrugated costs, and ensure a better customer sustainability experience." },
              { title: "“What if” Simulations", desc: "IT professionals have \"sandboxes\" to test new programs and technology. Xendflex Simulator enables logistics managers to test the cost and service impact of their decisions against historical data. Ex: \"What if I had used a regional carrier last November?\", \"What if I had fulfilled these orders from a different location?\", \"What if I had used different sized cartons?\"" }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-slate-100 space-y-4 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-medium text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Powerful Results */}
      <section className="py-24 bg-[#634a92] text-white">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Powerful Results</div>
            <h2 className="text-4xl font-light">Xendflex Makes Everyone a Winner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {[
              { icon: Globe, title: "Logistics", desc: "Automate data-driven decisions to expand capacity, control shipping costs, and keep your delivery promises using a more diverse carrier network." },
              { icon: Zap, title: "IT", desc: "Reduce cost of ownership and time to benefit with secure, cloud-native deployments. No-code configurations and connectors eliminate long IT project timelines and costs." },
              { icon: Shield, title: "Finance", desc: "No upfront license fees and minimal pro service costs. Only pay for what your organization needs to use with no hidden costs." },
              { icon: Search, title: "Marketing & Sales", desc: "Take the guesswork out of freight quoting. Instantly calculate rating and time in transit for more carrier options in shopping carts. Make and keep your customer delivery promises." },
              { icon: Zap, title: "Carriers", desc: "Use Xendflex Simulator to prove your service's cost savings and delivery improvements compared with your customer's existing carrier historical performance." },
              { icon: Package, title: "Shipping System Vendors", desc: "Enhance your offering by minimizing complex, inflexible scripting, and long IT project timelines. Xendflex shifts control of business rules from IT to logistics managers." }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="text-[#fbb03b]"><item.icon className="h-8 w-8" /></div>
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Ebook */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
              alt="Ebook Chart" 
              className="w-full h-auto shadow-2xl"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div className="text-[#634a92] font-bold text-[10px] uppercase tracking-[0.2em]">EBOOK</div>
            <h2 className="text-4xl text-slate-800 font-light leading-[1.1]">
              Xendflex TMS Protects Shipper Margins Against Parcel Industry Volatility & Uncertainty
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Controlling parcel costs requires a new approach, one that can easily adapt to a rapidly changing environment with intelligent decision-making at every stage of fulfillment. To protect their margins, shippers need to close the gap between expected vs. actual costs without compromising operational efficiency or customer service levels.
            </p>
            <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#fbb03b] hover:bg-[#e89e2c] text-black font-bold h-10 px-6 uppercase text-[10px] tracking-widest rounded-none"
            >
              Download Ebook Now!
            </Button>
          </div>
        </div>
      </section>

      {/* Section 6: Latest Article */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800" 
              alt="Latest Article" 
              className="w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div className="text-[#634a92] font-bold text-[10px] uppercase tracking-[0.2em]">LATEST ARTICLE</div>
            <h2 className="text-4xl text-slate-800 font-light leading-[1.1]">
              Why High-Speed Parcel Carrier Rating is the New Imperative for Controlling eCommerce Margins
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              To stay profitable, merchants need the ability to accurately predict and control the true cost of shipping at every stage of the cycle, from pre-order through to final invoice. This article makes the case for why intelligent, high-speed carrier rating and routing is a \"must-have\" for eCommerce shippers in 2024 and beyond, and what it actually takes to achieve it.
            </p>
            <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#fbb03b] hover:bg-[#e89e2c] text-black font-bold h-10 px-6 uppercase text-[10px] tracking-widest rounded-none"
            >
              Read the Article Now!
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
