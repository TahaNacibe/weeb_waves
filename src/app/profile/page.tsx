"use client";

import ProfileDashboard from "./components/profile_section";


// Main Profile Page Component
const ProfilePage = () => {
    return (
      <div className=" mx-auto md:p-6 p-1 space-y-8 bg-gray-900 min-h-screen">
        <ProfileDashboard />
      </div>
    );
  };
  
  export default ProfilePage;