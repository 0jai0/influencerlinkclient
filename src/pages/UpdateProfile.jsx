import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";
import AccountDetails from "../components/AccountDetails";
import Verification from "../components/Verification";
import PastPosts from "../components/PastPosts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./Navbar";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

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
    averageAudienceType: [],
    averageLocationOfAudience: [],
    pricing: { storyPost: "", feedPost: "", reel: "" },
    pastPosts: [],
    profilePicUrl: "",
  });

  const [user1, setUser1] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_API}/api/pageowners/user/${user?._id}`
        );
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser1(data.data);
      } catch (err) {
        // Handle error
      }
    };
    fetchUser();
  }, [user?._id]);

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
        averageLocationOfAudience: user1.averageLocationOfAudience || [],
        averageAudienceType: user1.averageAudienceType || [],
        pricing: user1.pricing || { storyPost: "", feedPost: "", reel: "" },
        pastPosts: user1.pastPosts || [],
        profilePicUrl: user1.profilePicUrl || "",
      });
    }
  }, [user1]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate, isAuthenticated]);

  const steps = [
    {
      label: "Personal Details",
      component: (
        <PersonalDetails
          profile={profile}
          setProfile={setProfile}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
    {
      label: "Add Social Media Accounts",
      component: <AccountDetails profile={profile} setProfile={setProfile} />,
    },
    {
      label: "Verification",
      component: (
        <Verification
          profileDetails={profile.profileDetails}
          setProfile={setProfile}
          userId={user?._id}
        />
      ),
    },
    {
      label: "Upload Posts",
      component: <PastPosts profile={profile} setProfile={setProfile} />,
    },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_API}/api/pageowners/updateUser/${user?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      //alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col h-screen w-full bg-black">
        <Navbar />

        {/* Progress Bar */}
        <div className="w-full md:w-[80%] mx-auto p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-start">
                {/* Step Circle (Dot) */}
                <div className="flex flex-row items-center space-x-2">
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
                    ></div>

                    {/* Step Label */}
                    <span
                    onClick={() => {
                      setCurrentStep(index);
                      handleSaveProfile();
                    }}
                      className={`text-sm transition-all ${
                        currentStep >= index
                          ? "text-transparent bg-clip-text bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)] font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                {/* Render Current Component Below the Step Label for Mobile View */}
                {currentStep === index && (
                  <div className="md:hidden border-l-[20px] border-black w-full mt-4">
                    {steps[currentStep].component}
                    {/* Navigation Buttons (Visible for Both Mobile and Desktop Views) */}
        <div className="p-5 w-full md:w-[80%]  flex bg-[#151515] justify-between">
          <button
            onClick={() => {
              setCurrentStep((prev) => Math.max(prev - 1, 0));
              handleSaveProfile();
            }}
            disabled={currentStep === 0}
            className={`px-1 py-2 h-10 rounded ${
              currentStep === 0
                ? "cursor-not-allowed text-white bg-[#272727]"
                : "cursor-pointer bg-[#272727] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)] text-white"
            }`}
          >
            {"<<"} Previous
          </button>
          {currentStep < steps.length - 1 ? (
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
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Render Active Step Component for Desktop View */}
        <div className="hidden md:block  w-full    flex-col justify-between h-full">
          <div className="flex-grow p-4">
            {steps[currentStep].component}
          </div>
          {/* Navigation Buttons (Visible for Both Mobile and Desktop Views) */}
        <div className="p-5 w-full md:w-[80%] mx-auto flex bg-[#151515] justify-between">
          <button
            onClick={() => {
              setCurrentStep((prev) => Math.max(prev - 1, 0));
              handleSaveProfile();
            }}
            disabled={currentStep === 0}
            className={`px-4 py-2 h-10 rounded ${
              currentStep === 0
                ? "cursor-not-allowed text-white bg-[#272727]"
                : "cursor-pointer bg-[#272727] hover:bg-[linear-gradient(180deg,#2BFFF8_50%,#1A9995_100%)] text-white"
            }`}
          >
            {"<<"} Previous
          </button>
          {currentStep < steps.length - 1 ? (
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

        
      </div>
    </GoogleOAuthProvider>
  );
};

export default UpdateProfile;