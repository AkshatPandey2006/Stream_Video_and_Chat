import { useState } from "react";
import { ShipWheelIcon, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>

      <div className="z-10 w-full max-w-5xl flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-base-100/80 backdrop-blur-md">
        
        {/* LEFT: FORM SECTION */}
        <div className="w-full lg:w-[45%] p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10 flex items-center gap-2 group cursor-pointer">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:rotate-45 transition-transform duration-500">
              <ShipWheelIcon className="size-8 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">Streamify</span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-base-content/60">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="alert alert-error mb-6 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error?.response?.data?.message || "Something went wrong"}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium opacity-70">Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control w-full">
              <div className="flex justify-between items-center px-1">
                <label className="label py-1">
                  <span className="label-text font-medium opacity-70">Password</span>
                </label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
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
                  <span>Sign In</span>
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-base-content/5 text-center">
            <p className="text-sm text-base-content/60">
              New to Streamify?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:text-primary-focus transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: FEATURE/BRAND SECTION */}
        <div className="hidden lg:flex lg:w-[55%] bg-primary p-12 flex-col justify-between relative text-primary-content overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80"></div>
          
          <div className="relative z-10">
            <div className="badge badge-outline text-primary-content/80 border-primary-content/20 gap-2 px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              Trusted by 10k+ learners
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <img 
                src="/i.png" 
                alt="Productivity" 
                className="w-full max-w-sm mx-auto drop-shadow-2xl animate-float"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
              />
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Master languages with <br /> native speakers.
            </h2>
            
            <div className="space-y-4 opacity-90">
              {[
                "Real-time video conversations",
                "Personalized learning paths",
                "Community-driven feedback"
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
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inline styles for custom animation */}
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

export default LoginPage;
