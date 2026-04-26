import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    comments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contact_inquiries'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      
      toast.success('Thank you! Your message has been sent to the Xendflex team.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        companyName: '',
        comments: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#634a92] py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl lg:text-5xl text-white font-light leading-tight">
              Interested in Learning How Smarter Shipping Creates Better Delivery Outcomes?
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 space-y-6"
            >
              <div className="text-[#634a92] font-bold text-[11px] uppercase tracking-widest">
                Contact Xendflex Technology
              </div>
              <h2 className="text-4xl text-slate-800 font-light leading-tight">
                We Want to Hear From You!
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
                Whether you are interested in our services, would like to partner with us, have questions, or just want to say hi.
              </p>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:w-1/2"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-slate-700">
                      First Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      required
                      placeholder=""
                      value={formData.firstName}
                      onChange={handleChange}
                      className="rounded-none border-slate-200 h-10 focus-visible:ring-[#634a92]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-slate-700">
                      Last Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      required
                      placeholder=""
                      value={formData.lastName}
                      onChange={handleChange}
                      className="rounded-none border-slate-200 h-10 focus-visible:ring-[#634a92]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    Email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-none border-slate-200 h-10 focus-visible:ring-[#634a92]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    Company Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    required
                    placeholder=""
                    value={formData.companyName}
                    onChange={handleChange}
                    className="rounded-none border-slate-200 h-10 focus-visible:ring-[#634a92]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments" className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    Comments
                  </Label>
                  <Textarea
                    id="comments"
                    required
                    placeholder=""
                    value={formData.comments}
                    onChange={handleChange}
                    className="rounded-none border-slate-200 min-h-[120px] focus-visible:ring-[#634a92]"
                  />
                </div>

                {/* Recaptcha Placeholder */}
                <div className="py-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 inline-flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 leading-none">protected by</span>
                      <span className="text-xs font-bold text-slate-600 leading-none">reCAPTCHA</span>
                    </div>
                    <div className="w-8 h-8 bg-white border border-slate-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-none bg-[#fbb03b] hover:bg-[#e89e2c] text-black font-bold h-12 px-8 uppercase tracking-widest border-none w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Contact Xendflex'
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
