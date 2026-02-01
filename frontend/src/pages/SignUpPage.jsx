import { useState } from "react";
import { ShipWheelIcon, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 relative overflow-hidden font-sans">
      {/* Background Decorative Elements - Match Login Page */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-base-100/80 backdrop-blur-md">
        
        {/* LEFT: BRAND/FEATURE SECTION (Flipped for Sign Up to keep it fresh) */}
        <div className="hidden lg:flex lg:w-[55%] bg-primary p-12 flex-col justify-between relative text-primary-content overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80"></div>
          
          <div className="relative z-10">
            <div className="badge badge-outline text-primary-content/80 border-primary-content/20 gap-2 px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              New Beta Features Live
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <img 
                src="/i.png" 
                alt="Community" 
                className="w-full max-w-sm mx-auto drop-shadow-2xl animate-float"
              />
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Unlock a world of <br /> new opportunities.
            </h2>
            
            <div className="space-y-4 opacity-90">
              {[
                "Connect with 100+ nationalities",
                "Advanced AI-powered matching",
                "Completely free to get started"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-secondary" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 text-xs opacity-50 flex justify-between">
            <span>© 2026 Streamify Inc.</span>
            <div className="flex gap-4">
              <span>Security</span>
              <span>Global</span>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM SECTION */}
        <div className="w-full lg:w-[45%] p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-2 group cursor-pointer lg:justify-end">
             <span className="text-2xl font-bold tracking-tighter">Streamify</span>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:rotate-45 transition-transform duration-500">
              <ShipWheelIcon className="size-8 text-primary" />
            </div>
          </div>

          <div className="space-y-2 mb-8 lg:text-right">
            <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
            <p className="text-base-content/60">
              Join the community and start learning.
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error?.response?.data?.message || "Failed to sign up"}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* FULL NAME */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium opacity-70">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium opacity-70">Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium opacity-70">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
              </div>
              <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest font-bold">Min. 6 characters</p>
            </div>

            {/* TERMS */}
            <div className="form-control pt-2">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" required />
                <span className="text-xs opacity-70">
                  I agree to the <span className="text-primary hover:underline underline-offset-2">Terms</span> and <span className="text-primary hover:underline underline-offset-2">Privacy Policy</span>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2 group relative overflow-hidden" 
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-base-content/5 text-center">
            <p className="text-sm text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-focus transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;
