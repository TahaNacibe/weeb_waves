import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon, Edit2, Camera, Check, Loader2, X } from 'lucide-react';
import FirebaseServices from '@/app/firebase/firebase_services';
import { auth } from '@/app/firebase/firebase';
import { useRouter } from 'next/compat/router';
import Link from 'next/link';

const ProfileDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Plan_to_watch');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const firebase_services = new FirebaseServices();
  
  const logOut = async () => {
    const result = await firebase_services.handleLogout();
    if (result) {
      return '/';
    }
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      try {
        const success = await firebase_services.updateUserProfile(uid, {
          userName: userData.userName,
        });
        if (success) {
          setIsEditing(false);
        }
      } catch (error) {
        setError('Failed to update profile');
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setUserData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        console.log("nothing...")
        return;
      } 
      setIsLoading(true);
      try {
        console.log("working on it")
        const result = await firebase_services.getUserData(uid);
        console.log("data recived : ",result)
        if (result) {
          setUserData(result);
        }
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const getStats = () => {
    if (!userData) return { watching: 0, plan_to_watch: 0, completed: 0 };
    return {
      watching: userData.watching?.length || 0,
      plan_to_watch: userData.Plan_to_watch?.length || 0,
      completed: userData.completed?.length || 0
    };
  };

  const stats = getStats();

  const listCategories = [
    { id: 'Plan_to_watch', label: 'Plan to Watch', color: 'yellow' },
    { id: 'watching', label: 'Watching', color: 'green' },
    { id: 'completed', label: 'Completed', color: 'blue' },
    { id: 'dropped', label: 'Dropped', color: 'red' },
    { id: 'on-Hold', label: 'On Hold', color: 'orange' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 mt-8 text-gray-200 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center justify-between">
            <span className="text-sm sm:text-base">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
            <div className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto">
                  {/* Profile Photo */}
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      {userData?.photoURL ? (
                        <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
                      )}
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Name and Username */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={userData?.userName || ''}
                          onChange={(e) => handleProfileUpdate('userName', e.target.value)}
                          className="text-xl sm:text-2xl font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none w-full text-gray-200"
                          placeholder="Your name"
                        />
                        <input
                          type="text"
                          value={`@${String(userData?.userName || '').toLowerCase().replace(" ","")}`}
                          readOnly={true}
                          className="text-sm sm:text-base text-gray-400 bg-transparent border-b-2 border-blue-500/50 focus:outline-none w-full cursor-not-allowed"
                          placeholder="@username"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">{userData?.userName}</h2>
                        <p className="text-sm sm:text-base text-gray-400">{`@${String(userData?.userName || '').toLowerCase().replace(" ","")}_${(auth.currentUser?.uid! ?? "1234").substring(0,5)}`}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                  <button 
                    onClick={handleEditProfile}
                    className={`flex items-center px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isEditing 
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Edit
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={logOut}
                    className="text-gray-400 hover:text-white border border-gray-700 hover:bg-white/10 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-5 py-2 text-center inline-flex items-center transition-all duration-300"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-200 mb-4">Overview</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300">
                <span className="text-sm sm:text-base text-gray-300">Watching</span>
                <span className="font-medium text-green-400">{stats.watching}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300">
                <span className="text-sm sm:text-base text-gray-300">Plan to Watch</span>
                <span className="font-medium text-yellow-400">{stats.plan_to_watch}</span>
              </div>
              <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300">
                <span className="text-sm sm:text-base text-gray-300">Completed</span>
                <span className="font-medium text-blue-400">{stats.completed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="border-b border-gray-700">
            <div className="flex overflow-x-auto scrollbar-hide">
              {listCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-300 relative whitespace-nowrap
                    ${activeTab === category.id ? `text-${category.color}-400` : 'text-gray-400 hover:text-gray-200'}`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.label}
                  {activeTab === category.id && (
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${category.color}-400`} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-2 sm:p-6 overflow-x-auto">
            <table className="w-full text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Cover</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">Title</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium hidden sm:table-cell">Type</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium hidden sm:table-cell">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium hidden sm:table-cell">Rank</th>
                </tr>
              </thead>
              <tbody>
                {userData?.[activeTab]?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-400">
                      No anime in this list yet
                    </td>
                  </tr>
                ) : (
                  userData?.[activeTab]?.map((anime: any) => (
                    <tr key={anime.mal_id} className="border-b border-gray-700 last:border-0 hover:bg-gray-700/30 transition-colors duration-300">
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <Link href={`/details/${anime.mal_id}?animeName=${anime.title}&animeId=${anime.mal_id}`}>
                          <img 
                            src={anime.cover} 
                            alt={anime.title} 
                            className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-md hover:scale-150 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium">
                        <Link href={`/details/${anime.mal_id}?animeName=${anime.title}&animeId=${anime.mal_id}`}>
                          <div className="hover:text-blue-400 cursor-pointer transition-colors duration-300 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                          {anime.title}
                        </div>
                              </Link>
                      </td>
                      <td className="py-4 px-4">{anime.type}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${anime.status === 'Currently Airing' ? 'bg-green-900/50 text-green-400' : 
                          'bg-blue-900/50 text-blue-400'}`}>
                          {anime.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">#{anime.rank}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;