import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";
import AccountDetails from "../components/AccountDetails";
import Verification from "../components/Verification";
import PastPosts from "../components/PastPosts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./Navbar";

const CLIENT_ID = "264166008170-nnjc496qlj2bvlhkgqg5v5qbd1fmdc33.apps.googleusercontent.com";


const UpdateProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    ownerName: "",
    mobile: "",
    email: "",
    whatsapp: "",
    socialMediaPlatforms: [],
    profileDetails: [],
    adCategories: [],
    pageContentCategory: [],
    pricing: { storyPost: "", feedPost: "", reel: "" },
    pastPosts: [],
    profilePicUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // Step tracking
  const [saving, setSaving] = useState(false); // Track save button state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/pageowners/user/${user?.id}`
        );
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser1(data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, [user?.id]);

  // Populate profile state with fetched user data
  useEffect(() => {
    if (user1) {
      setProfile({
        ownerName: user1.ownerName || "",
        mobile: user1.mobile || "",
        email: user1.email || "",
        whatsapp: user1.whatsapp || "",
        socialMediaPlatforms: user1.socialMediaPlatforms || [],
        profileDetails: user1.profileDetails || [],
        adCategories: user1.adCategories || [],
        pageContentCategory: user1.pageContentCategory || [],
        pricing: user1.pricing || { storyPost: "", feedPost: "", reel: "" },
        pastPosts: user1.pastPosts || [],
        profilePicUrl: user1.profilePicUrl || "",
      });
    }
  }, [user1]);

  // Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate, isAuthenticated]);

  // Step navigation logic
  const steps = [
    { label: "Personal Details", component: <PersonalDetails profile={profile} setProfile={setProfile} currentStep={currentStep} setCurrentStep={setCurrentStep}/> },
    { label: "Add Social Media Accounts", component: <AccountDetails profile={profile} setProfile={setProfile} /> },
    { label: "Verification", component: <Verification profileDetails={profile.profileDetails} setProfile={setProfile} userId = {user?.id} /> },

    { label: "Upload Posts", component: <PastPosts profile={profile} setProfile={setProfile} /> },
  ];

  // Save Profile Function
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/pageowners/updateUser/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      //alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full md:w-[80%] bg-black">
      {/* Navbar at the top */}
      <Navbar />

      {/* Progress Bar */}
      <div className="relative flex items-center justify-between w-[60%] mx-auto space-x-6  m-20">
      {/* Full Gray Line */}
      
      {steps.map((step, index) => (
  <div key={index} className="relative flex flex-col items-center justify-between">
    

    {/* Step Circle (Dot) */}
    <div
      className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 ${
        currentStep >= index
          ? "bg-[linear-gradient(180deg,#2BFFF8_0%,#1A9995_100%)] scale-100 shadow-lg"
          : "bg-gray-300"
      }`}
      onClick={() => {
        setCurrentStep(index);
        handleSaveProfile();
      }}
    >
     
    </div>

    {/* Step Label */}
    <span
      className={`text-sm mt-4 transition-all ${
        currentStep >= index ? "text-blue-500 font-bold" : "text-gray-400"
      }`}
    >
      {step.label}
    </span>
  </div>
))}
    </div>

    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {/* Render Current Step Component */}
      <div className="w-full md:w-[80%] mx-auto flex justify-center">{steps[currentStep].component}</div>
      </GoogleOAuthProvider>
      {/* Navigation Buttons */}
      
      <div className="p-5 w-full md:w-[80%] mx-auto flex bg-[#151515] h-full justify-between">
        <button
          onClick={() => {setCurrentStep((prev) => Math.max(prev - 1, 0));handleSaveProfile();}}
          disabled={currentStep === 0}
          className={`px-4 py-2 h-10 rounded ${
            currentStep === 0 ? "cursor-not-allowed text-white bg-[#272727]" : "cursor-pointer bg-[#272727] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)] text-white"
          }`}
        >
         {"<<"} Previous
        </button>
        {currentStep <= 2 ? (
  <button
    onClick={() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      handleSaveProfile();
    }}
    disabled={currentStep === steps.length - 1}
    className={`px-4 py-2 h-10 rounded ${
      currentStep === steps.length - 1
        ? "cursor-not-allowed text-white bg-[#272727]"
        : "cursor-pointer bg-[#272727] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)] text-white"
    }`}
  >
    Save & Next {">>"}
  </button>
) : (
  <div className="flex justify-center">
    <button
      onClick={handleSaveProfile}
      disabled={saving}
      className={`px-4 py-2 h-10 rounded ${
        currentStep === steps.length 
          ? "cursor-not-allowed bg-[#272727]"
          : "cursor-pointer text-black bg-[#272727] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)]"
      } ${
        currentStep === steps.length 
          ? "text-transparent text-black bg-clip-text bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)]"
          : "text-white"
      }`}
    >
      {saving ? "Saving..." : "Submit"}
    </button>
  </div>
)}

      </div>
      </div>

      
  
  );
};

export default UpdateProfile;
