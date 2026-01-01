"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, Phone, Check, Building2, MapPin, FileText, ChevronDown } from "lucide-react";
import { merchantSignup, merchantVerifyPhone } from "../Data/authLoginInfo";
import { authStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";

const COUNTRIES = [
    { code: '+91', flag: '🇮🇳' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+44', flag: '🇬🇧' }
];

export default function MerchantSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Signup States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Merchant Specific States
  const [gstNumber, setGstNumber] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [shopName, setShopName] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");

  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const router = useRouter();

  const handleVerifyPhone = async () => {
    if (phoneNumber.length !== 10) return;
    
    setIsVerifying(true);
    setError(null);
    
    // Simulate API call for smooth UI flow
    setTimeout(() => {
      setIsVerifying(false);
      setIsPhoneVerified(true);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus logic
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await merchantSignup({ 
          firstName, 
          lastName, 
          email, 
          password,
          phone: phoneNumber,
          otp: otp.join(""),
          gstNumber,
          shopAddress,
          shopName,
          establishedYear
      });
      
      authStore.login({
        id: data.id || 'merchant-id',
        email: data.email || email,
        name: `${firstName} ${lastName}`,
        type: 'merchant',
        token: data.token
      });

      router.push('/dashboard/merchant'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full max-w-[420px] space-y-10">
      <motion.div 
         initial="hidden" 
         animate="visible" 
         transition={{ staggerChildren: 0.1 }}
         className="space-y-2"
      >
        <motion.h2 variants={variants} className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Merchant Registration
        </motion.h2>
        <motion.p variants={variants} className="text-[var(--text-muted)]">
          Join our network of professional auto parts sellers
        </motion.p>
      </motion.div>

      {/* Form */}
      <motion.form 
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        
        {/* Name Fields */}
        <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label 
                htmlFor="firstName" 
                className={`text-sm font-medium transition-colors ${focusedField === 'firstName' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
              >
                First Name
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className="
                    w-full px-4 py-3 pl-11
                    bg-[var(--surface)] border border-transparent 
                    rounded-xl text-[var(--foreground)] 
                    placeholder:text-[var(--text-muted)]/50
                    focus:bg-white focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/10
                    transition-all duration-200
                  "
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'firstName' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                  <User size={20} />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <label 
                htmlFor="lastName" 
                className={`text-sm font-medium transition-colors ${focusedField === 'lastName' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
              >
                Last Name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className="
                    w-full px-4 py-3 pl-11
                    bg-[var(--surface)] border border-transparent 
                    rounded-xl text-[var(--foreground)] 
                    placeholder:text-[var(--text-muted)]/50
                    focus:bg-white focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/10
                    transition-all duration-200
                  "
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'lastName' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                  <User size={20} />
                </div>
              </div>
            </div>
        </div>

        {/* Business Details */}
        <div className="space-y-4 pt-2 border-t border-[var(--border)]/50">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Business Details</h3>
            
            {/* Shop Name */}
            <div className="space-y-2">
                <label htmlFor="shopName" className={`text-sm font-medium ${focusedField === 'shopName' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>Shop Name</label>
                <div className="relative">
                    <input
                        id="shopName"
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Auto Parts Co."
                        onFocus={() => setFocusedField('shopName')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 pl-11 bg-[var(--surface)] rounded-xl focus:bg-white focus:ring-[var(--accent)]/10"
                    />
                    <Building2 size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
            </div>

             {/* GST and Year */}
             <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                    <label htmlFor="gst" className={`text-sm font-medium ${focusedField === 'gst' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>GST Number</label>
                    <div className="relative">
                        <input id="gst" type="text" required value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GSTIN..." 
                            className="w-full px-4 py-3 pl-11 bg-[var(--surface)] rounded-xl" onFocus={() => setFocusedField('gst')} onBlur={() => setFocusedField(null)}/>
                        <FileText size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                </div>
                <div className="space-y-2 w-1/3">
                    <label htmlFor="year" className={`text-sm font-medium ${focusedField === 'year' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>Since</label>
                    <input id="year" type="number" required value={establishedYear} onChange={(e) => setEstablishedYear(e.target.value)} placeholder="2010" 
                        className="w-full px-4 py-3 bg-[var(--surface)] rounded-xl"/>
                </div>
             </div>

             {/* Address */}
             <div className="space-y-2">
                <label htmlFor="address" className={`text-sm font-medium ${focusedField === 'address' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>Shop Address</label>
                <div className="relative">
                    <textarea
                        id="address"
                        required
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                        placeholder="Full street address..."
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 pl-11 bg-[var(--surface)] rounded-xl min-h-[80px]"
                    />
                    <MapPin size={20} className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
                </div>
             </div>
        </div>

        {/* Contact Info (Separated) */}
        <div className="space-y-4 pt-2 border-t border-[var(--border)]/50">
             <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Contact & Credentials</h3>
        
            {/* Email Field */}
            <div className="space-y-2">
            <label 
                htmlFor="email" 
                className={`text-sm font-medium transition-colors ${focusedField === 'email' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
                Email
            </label>
            <div className="relative">
                <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@business.com"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="
                    w-full px-4 py-3 pl-11
                    bg-[var(--surface)] border border-transparent 
                    rounded-xl text-[var(--foreground)] 
                    placeholder:text-[var(--text-muted)]/50
                    focus:bg-white focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/10
                    transition-all duration-200
                "
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                <Mail size={20} />
                </div>
            </div>
            </div>

            {/* Phone Number Field with Verification */}
            <div className="space-y-2 relative z-20"> 
            <label 
                htmlFor="phone" 
                className={`text-sm font-medium transition-colors ${focusedField === 'phone' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
                Mobile Number
            </label>
            <div className="relative flex gap-2">
                
                {/* Country Code Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="
                           h-[50px] px-3 flex items-center gap-2
                           bg-[var(--surface)] border border-transparent 
                           rounded-xl text-[var(--foreground)]
                           hover:bg-[var(--surface-hover)] transition-colors
                           focus:ring-2 focus:ring-[var(--accent)]/10 outline-none
                        "
                    >
                        <span className="text-lg">{COUNTRIES.find(c => c.code === countryCode)?.flag}</span>
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{countryCode}</span>
                        <ChevronDown size={14} className={`text-black transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showCountryDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 mt-2 w-32 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50 py-1"
                            >
                                {COUNTRIES.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            setCountryCode(country.code);
                                            setShowCountryDropdown(false);
                                        }}
                                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-black/5 transition-colors text-left"
                                    >
                                        <span className="text-lg">{country.flag}</span>
                                        <span className="text-sm text-black">{country.code}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative flex-1">
                    <input
                    id="phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); 
                        if (val.length <= 10) setPhoneNumber(val);
                    }}
                    placeholder="1234567890"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className="
                        w-full h-[50px] px-4 pl-11 pr-24
                        bg-[var(--surface)] border border-transparent 
                        rounded-xl text-[var(--foreground)] 
                        placeholder:text-[var(--text-muted)]/50
                        focus:bg-white focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/10
                        transition-all duration-200
                    "
                    />
                    <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'phone' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                    <Phone size={20} />
                    </div>

                {/* Verify Button */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AnimatePresence>
                        {phoneNumber.length === 10 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={handleVerifyPhone}
                                disabled={isVerifying || isPhoneVerified}
                                className={`
                                    text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors
                                    ${isPhoneVerified 
                                        ? 'bg-[var(--surface-hover)] text-[var(--text-muted)] cursor-default' 
                                        : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                                    }
                                `}
                            >
                                {isVerifying ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    "Verify"
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                </div>
            </div>
            </div>

            {/* OTP Field - Appears after verification */}
            <AnimatePresence>
                {isPhoneVerified && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden space-y-2"
                    >
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Enter OTP Code <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { otpInputRefs.current[index] = el }}
                                    type="text"
                                    maxLength={1}
                                    required
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="
                                        w-12 h-12 text-center text-lg font-bold
                                        bg-[var(--surface)] border border-transparent 
                                        rounded-lg text-[var(--foreground)] 
                                        focus:bg-white focus:border-[var(--accent)]/30 focus:ring-2 focus:ring-[var(--accent)]/10
                                        transition-all duration-200 outline-none
                                    "
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Password Field */}
            <div className="space-y-2">
            <label 
                htmlFor="password" 
                className={`text-sm font-medium transition-colors ${focusedField === 'password' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
            >
                Password
            </label>
            <div className="relative">
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="
                    w-full px-4 py-3 pl-11 pr-11
                    bg-[var(--surface)] border border-transparent 
                    rounded-xl text-[var(--foreground)] 
                    placeholder:text-[var(--text-muted)]/50
                    focus:bg-white focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/10
                    transition-all duration-200
                "
                />
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                <Lock size={20} />
                </div>
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors p-1"
                >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || !isPhoneVerified}
          type="submit"
          className="
            w-full flex items-center justify-center gap-2
            bg-[var(--accent)] text-white 
            py-3.5 rounded-xl font-bold text-sm tracking-wide
            shadow-xl shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/40
            disabled:opacity-70 disabled:cursor-not-allowed
            transition-all duration-300
          "
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Register Business <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </motion.button>
      </motion.form>

        <p className="text-center text-sm text-[var(--text-secondary)] py-4">
            Already have an account?{" "}
            <Link 
            href="/login" 
            className="font-bold text-[var(--accent)] hover:underline"
            >
            Sign in
            </Link>
        </p>

    </div>  
  );
}
