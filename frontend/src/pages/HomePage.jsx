import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Sparkles, Search, ArrowUpRight } from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-base-200/50 pb-20">
      {/* HEADER HERO AREA */}
      <div className="bg-base-100 border-b border-base-content/5 pt-8 pb-12 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <Sparkles className="size-4" />
                <span>Dashboard</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight">Your Network</h1>
              <p className="text-base-content/60 max-w-md">
                Manage your connections and discover new language partners from around the globe.
              </p>
            </div>
            <Link to="/notifications" className="btn btn-primary shadow-lg shadow-primary/20 group">
              <UsersIcon className="size-4 mr-2" />
              Friend Requests
              <div className="badge badge-sm badge-secondary ml-2 group-hover:scale-110 transition-transform">
                {outgoingFriendReqs?.length || 0}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* FRIENDS SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UsersIcon className="size-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Current Friends</h2>
          </div>

          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-base-100 animate-pulse rounded-2xl border border-base-content/5" />
              ))}
            </div>
          ) : friends.length === 0 ? (
            <div className="bg-base-100 rounded-3xl p-12 border border-dashed border-base-content/20">
              <NoFriendsFound />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* RECOMMENDED USERS SECTION */}
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="text-sm text-base-content/60 flex items-center gap-2">
                <Search className="size-3" />
                Based on your learning preferences
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-ring loading-lg text-primary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-100 border border-base-content/5 p-10 text-center shadow-sm">
              <h3 className="font-bold text-xl mb-2">Finding more partners...</h3>
              <p className="opacity-60 text-sm">We'll notify you when new matches join the community.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="group bg-base-100 hover:bg-base-200/50 rounded-3xl border border-base-content/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="avatar">
                          <div className="size-20 rounded-2xl ring-4 ring-base-200 group-hover:ring-primary/20 transition-all">
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="badge badge-ghost text-[10px] font-bold uppercase tracking-tighter">
                            {user.location || "Remote"}
                          </span>
                          <div className="flex -space-x-2">
                             <div className="size-8 rounded-full border-2 border-base-100 bg-base-200 flex items-center justify-center text-sm shadow-sm">
                                {getLanguageFlag(user.nativeLanguage)}
                             </div>
                             <div className="size-8 rounded-full border-2 border-base-100 bg-base-200 flex items-center justify-center text-sm shadow-sm">
                                {getLanguageFlag(user.learningLanguage)}
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-xl group-hover:text-primary transition-colors flex items-center gap-1">
                            {user.fullName}
                            <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-all" />
                          </h3>
                          <div className="flex items-center text-xs opacity-50 font-medium">
                            <MapPinIcon className="size-3 mr-1" />
                            Active Recently
                          </div>
                        </div>

                        <div className="p-3 bg-base-200/50 rounded-xl">
                          <p className="text-sm line-clamp-2 italic opacity-80">
                            "{user.bio || "No bio available yet."}"
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                           <div className="flex-1 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                              <p className="text-[10px] uppercase font-bold opacity-50">Native</p>
                              <p className="text-xs font-bold">{capitialize(user.nativeLanguage)}</p>
                           </div>
                           <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/5 border border-secondary/10">
                              <p className="text-[10px] uppercase font-bold opacity-50">Learning</p>
                              <p className="text-xs font-bold">{capitialize(user.learningLanguage)}</p>
                           </div>
                        </div>

                        <button
                          className={`btn btn-block rounded-2xl border-none transition-all ${
                            hasRequestBeenSent 
                            ? "bg-success/10 text-success hover:bg-success/20" 
                            : "btn-primary shadow-lg shadow-primary/20"
                          } `}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Connect
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
