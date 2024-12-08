"use client"
import { useState, useEffect } from "react";
import { Menu, X, Home, Film, Tv, Search, TrendingUp, Calendar, Route } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ProfileAndSignInButton from "../components/profile_sign_in";

export default function NavBar() {
  const router = useRouter();
  const parm = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScrollState = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScrollState();
    window.addEventListener("scroll", handleScrollState);

    return () => {
      window.removeEventListener("scroll", handleScrollState);
    };
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen)
    router.push(`/search/Search?q=${searchQuery}`)
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Top Anime", href: "/anime/Top%20Anime", icon: TrendingUp },
    { name: "Movies", href: "/movies/Movies", icon: Film },
    { name: "Seasons", href: "/seasons/Season?year=2024&season=summer", icon: Calendar },
  ];

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav 
      style={{
        background: isScrolled 
          ? 'rgba(0, 0, 0, 0.4)' 
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)'
      }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'backdrop-blur-sm shadow-lg before:absolute before:inset-0 before:w-full before:h-[0.5px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent' 
          : 'backdrop-blur-[2px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
          <ProfileAndSignInButton />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                      ${isScrolled
                        ? 'text-gray-300 hover:text-white'
                        : 'text-white/90 hover:text-white'
                      } transition-colors duration-200`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Search Button */}
          <div className="hidden md:flex items-center ml-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full ${
                isScrolled 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-white/90 hover:text-white'
              } transition-colors duration-200`}
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-white/90 hover:text-white transition-colors duration-200"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/90 hover:text-white transition-colors duration-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`transition-all duration-300 overflow-hidden mx-auto ${
          isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <form onSubmit={handleSearch} className="py-3 px-2">
            <div className="relative max-w-screen mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15
                  transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 
                  hover:text-white transition-colors duration-200 rounded-full
                  hover:bg-white/10"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        } overflow-hidden`}
      >
        <div className={`px-2 pt-2 pb-3 space-y-1 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-sm' 
            : 'bg-transparent'
        }`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium 
                  ${isScrolled
                    ? 'text-gray-300 hover:text-white'
                    : 'text-white/90 hover:text-white'
                  } transition-colors duration-200`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}