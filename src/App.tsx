import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/Navbar';
import { Home } from '@/pages/Home';
import { Admin } from '@/pages/Admin';
import { Tracking } from '@/pages/Tracking';
import { Contact } from '@/pages/Contact';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/track/:id" element={<Tracking />} />
            <Route path="/admin" element={<Admin user={user} />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Toaster />
        
        <footer className="bg-[#1a1a1a] text-slate-400 py-20 border-t border-slate-800">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
            <div className="space-y-6">
              <Link to="/" className="flex flex-col">
                <span className="text-3xl font-bold tracking-tighter text-white leading-none">xendflex</span>
                <span className="text-[10px] tracking-[0.2em] font-light text-slate-400 uppercase leading-none ml-0.5">technology</span>
              </Link>
              <div className="space-y-1 text-xs">
                <p>Xendflex Technology, Inc.</p>
                <p>1900 West Park Dr. Suite 280</p>
                <p>Westborough, MA 01581</p>
                <p>United States</p>
                <p className="pt-2">Phone 508.983.1453</p>
              </div>
              <div className="pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150" 
                  alt="Quality Badge" 
                  className="w-32 h-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-[11px] uppercase tracking-widest">Complexity Conquered</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-tight text-white/60">
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Platform</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Optimization</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Solutions</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Industries</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Partners</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-[11px] uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-tight text-white/60">
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-[#fbb03b] transition-colors">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-[#fbb03b] transition-colors text-[#fbb03b]">Request a Consultation</Link></li>
                <li><Link to="/contact" className="hover:text-[#fbb03b] transition-colors">Request Pricing Information</Link></li>
                <li><Link to="/" className="hover:text-[#fbb03b] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-white font-bold mb-6 text-[11px] uppercase tracking-widest">Administrative</h4>
                <div className="space-y-2">
                  {!user ? (
                    <button 
                      onClick={async () => {
                        const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
                        try {
                          await signInWithPopup(auth, new GoogleAuthProvider());
                          // user state will update via listener
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                      className="text-xs text-white/40 hover:text-white transition-colors"
                    >
                      Staff Portal
                    </button>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={async () => {
                          const { signOut } = await import('firebase/auth');
                          await signOut(auth);
                        }}
                        className="text-xs text-white/40 hover:text-white transition-colors text-left"
                      >
                        Log Out ({user.email})
                      </button>
                      {user.email === 'fastinsms.com@gmail.com' && (
                        <Link to="/admin" className="text-xs text-[#fbb03b] hover:opacity-80 transition-opacity">
                          Go to Admin Console
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <h4 className="text-white font-bold mt-8 mb-6 text-[11px] uppercase tracking-widest">Social</h4>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="inline-block p-2 bg-slate-800 rounded hover:bg-[#634a92] transition-colors">
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.373-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
              </div>
              <div className="text-[10px] text-white/30 pt-12">
                &copy; 2025 Xendflex Technology, Inc. All rights reserved
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
