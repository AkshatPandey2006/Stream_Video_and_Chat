import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon, User, Globe2, BookOpen, Quote } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("New avatar generated!");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-base-200 relative overflow-hidden font-sans p-4">
      {/* Background Decorative Elements - Matching Login/Signup */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full"></div>

      <div className="z-10 w-full max-w-4xl bg-base-100/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-white/10">
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT SIDE: STEPS & INFO */}
          <div className="w-full md:w-1/3 bg-primary p-8 text-primary-content flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/80 opacity-95"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                   <ShipWheelIcon className="size-8" />
                   <span className="text-xl font-bold tracking-tighter">Streamify</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-6">Setup your <br /> profile</h2>
                
                <ul className="space-y-6">
                   <li className="flex items-center gap-4">
                      <div className="size-8 rounded-full bg-primary-content text-primary flex items-center justify-center font-bold text-sm">1</div>
                      <span className="font-medium opacity-90">Basic Info</span>
                   </li>
                   <li className="flex items-center gap-4">
                      <div className="size-8 rounded-full border border-primary-content/30 text-primary-content flex items-center justify-center font-bold text-sm">2</div>
                      <span className="font-medium opacity-50">Preferences</span>
                   </li>
                   <li className="flex items-center gap-4">
                      <div className="size-8 rounded-full border border-primary-content/30 text-primary-content flex items-center justify-center font-bold text-sm">3</div>
                      <span className="font-medium opacity-50">Verify</span>
                   </li>
                </ul>
             </div>

             <div className="relative z-10 mt-12 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-xs italic opacity-80">"A different language is a different vision of life."</p>
                <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">— Federico Fellini</p>
             </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="w-full md:w-2/3 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* AVATAR SECTION */}
              <div className="flex flex-col items-center sm:flex-row gap-6 bg-base-200/50 p-6 rounded-2xl border border-base-content/5">
                <div className="relative group">
                  <div className="size-24 rounded-full bg-base-300 ring-4 ring-primary/10 overflow-hidden transition-all group-hover:ring-primary/30">
                    {formState.profilePic ? (
                      <img src={formState.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-8 opacity-20" />
                      </div>
                    )}
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRandomAvatar}
                    className="absolute -bottom-2 -right-2 btn btn-circle btn-primary btn-sm shadow-lg hover:scale-110 transition-transform"
                  >
                    <ShuffleIcon className="size-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg">Profile Photo</h3>
                  <p className="text-xs opacity-60 max-w-[200px]">Generate a unique avatar or upload your own later.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* FULL NAME */}
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold opacity-70">Display Name</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                    <input
                      type="text"
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>
                </div>

                {/* LANGUAGES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text font-semibold opacity-70">Native In</span></label>
                    <div className="relative">
                      <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40 z-10" />
                      <select
                        value={formState.nativeLanguage}
                        onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                        className="select select-bordered w-full pl-10 focus:select-primary transition-all"
                        required
                      >
                        <option value="">Select Native</option>
                        {LANGUAGES.map((lang) => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label py-1"><span className="label-text font-semibold opacity-70">Learning</span></label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40 z-10" />
                      <select
                        value={formState.learningLanguage}
                        onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                        className="select select-bordered w-full pl-10 focus:select-primary transition-all"
                        required
                      >
                        <option value="">Select Target</option>
                        {LANGUAGES.map((lang) => <option key={lang} value={lang.toLowerCase()}>{lang}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold opacity-70">Location</span></label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-40" />
                    <input
                      type="text"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="input input-bordered w-full pl-10 focus:input-primary transition-all"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                {/* BIO */}
                <div className="form-control">
                  <label className="label py-1"><span className="label-text font-semibold opacity-70">Short Bio</span></label>
                  <div className="relative">
                    <Quote className="absolute left-3 top-4 size-5 opacity-40" />
                    <textarea
                      value={formState.bio}
                      onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                      className="textarea textarea-bordered w-full pl-10 min-h-[100px] focus:textarea-primary transition-all"
                      placeholder="Share your goals and interests..."
                    />
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary w-full group overflow-hidden relative shadow-xl" 
                disabled={isPending} 
                type="submit"
              >
                {isPending ? (
                  <LoaderIcon className="animate-spin size-5" />
                ) : (
                  <>
                    <span>Start Your Adventure</span>
                    <ShipWheelIcon className="size-5 ml-2 group-hover:rotate-90 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
