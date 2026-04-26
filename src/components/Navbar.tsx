import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Package, Shield, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const isAdmin = user?.email === 'fastinsms.com@gmail.com';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-bold tracking-tighter text-[#634a92] leading-none">xendflex</span>
          <span className="text-[10px] tracking-[0.2em] font-light text-slate-400 uppercase leading-none ml-0.5">technology</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-6 text-[11px] font-bold tracking-widest text-[#634a92] uppercase">
          <Link to="/" className="hover:opacity-70 transition-opacity">Platform</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Optimization</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Solutions</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Industries</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Partners</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">Resources</Link>
          <Link to="/" className="hover:opacity-70 transition-opacity">About</Link>
          <Link to="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="text-blue-600">Admin</Link>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Link 
            to="/track/DEMO"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-[10px] font-bold border border-[#634a92] text-[#634a92] h-8 px-4 uppercase rounded-none"
            )}
          >
            Tracking
          </Link>
          <Link 
            to="/contact"
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-[10px] font-bold bg-[#fbb03b] hover:bg-[#e89e2c] text-black h-8 px-4 uppercase rounded-none border-none"
            )}
          >
            Request Consultation
          </Link>
        </div>
      </div>
    </nav>
  );
}
