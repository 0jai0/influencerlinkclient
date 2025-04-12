import Select from "react-select";
import { Trash2 } from "lucide-react";
import { 
  platforms,
  audienceTypeOptions,
  adCategoryOptions,
  pageContentCategoryOptions
} from '../constants'; // or '../constants/index'


const AccountDetails = ({ profile, setProfile }) => {
  // Platform options
  
//console.log(profile.averageLocationOfAudience);
  // Pricing structure
  const pricingStructure = {
    storyPost: profile.pricing?.storyPost || "",
    feedPost: profile.pricing?.feedPost || "",
    reel: profile.pricing?.reel || "",
  };

  // Remove social media account
  const removeAccount = (index) => {
    const updatedDetails = profile.profileDetails.filter((_, i) => i !== index);
    setProfile({ ...profile, profileDetails: updatedDetails });
  };

  // Handle select changes with limit of 3 selections
  const handleSelectChange = (selectedOptions, field) => {
    const limitedSelection = selectedOptions.slice(0, 20);
    setProfile({
      ...profile,
      [field]: limitedSelection.map((option) => option.value),
    });
  };

  // Handle quick category selection
  const handleButtonClick = (category, field) => {
    if (!profile[field]?.includes(category) && (profile[field]?.length || 0) < 20) {
      setProfile({
        ...profile,
        [field]: [...(profile[field] || []), category],
      });
    }
  };

  // Handle profile detail changes
  const handleProfileDetailChange = (index, field, value) => {
    const updatedDetails = [...profile.profileDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setProfile({ ...profile, profileDetails: updatedDetails });
  };

  // Handle pricing changes
  const handlePricingChange = (field, value) => {
    setProfile({
      ...profile,
      pricing: {
        ...profile.pricing,
        [field]: value,
      },
    });
  };

  // Add new profile detail
  const addProfileDetail = () => {
    setProfile({
      ...profile,
      profileDetails: [
        ...profile.profileDetails,
        { 
          platform: "", 
          profileName: "", 
          profilePicUrl: "", 
          profileDashboardPic: "",
          followers: "", 
          verified: false 
        },
      ],
    });
  };
  const addLocation = (location) => {
    setProfile({
      ...profile,
      averageLocationOfAudience: [
        ...(profile.averageLocationOfAudience || []),
        location
      ]
    });
  };
  
  const removeLocation = (index) => {
    const updatedLocations = [...profile.averageLocationOfAudience];
    updatedLocations.splice(index, 1);
    setProfile({
      ...profile,
      averageLocationOfAudience: updatedLocations
    });
  };
  
  return (
    <div className="w-full h-full bg-[#151515] p-5 shadow-md  flex flex-col items-center">
      <h2 className="text-xl font-bold mb-6 text-white self-start">Account Details</h2>

      <div className="gap-6 w-[90%] flex flex-col items-center">
        {/* Social Media Platforms */}
        <div className="w-full">
  <h3 className="text-white font-medium mb-2">Social Media Platforms</h3>
  <Select
    isMulti
    options={platforms.map(platform => ({ value: platform, label: platform }))}
    value={profile.socialMediaPlatforms?.map(platform => ({ value: platform, label: platform })) || []}
    onChange={(selectedOptions) => setProfile({
      ...profile,
      socialMediaPlatforms: selectedOptions.map(option => option.value)
    })}
    className="w-full "
    styles={{
      control: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        borderColor: "#272727",
        color: "white",
        minHeight: "40px",
      }),
      input: (provided) => ({
        ...provided,
        color: "white",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        color: "white",
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#333",
        color: "white",
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1E1E1E" : "#272727",
        color: "white",
        ":hover": {
          backgroundColor: "#1E1E1E",
        },
      }),
    }}
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {platforms
      .filter(platform => !profile.socialMediaPlatforms?.includes(platform))
      .sort(() => Math.random() - 0.5)
      .map(platform => (
        <button
          key={platform}
          onClick={() => setProfile({
            ...profile,
            socialMediaPlatforms: [...(profile.socialMediaPlatforms || []), platform]
          })}
          className="px-3 py-1 text-xs rounded-full bg-[#333] text-gray-300 hover:bg-[#444] transition-colors"
        >
          + {platform}
        </button>
      ))}
  </div>
</div>

<div className="w-full">
  <h3 className="text-white font-medium mb-2">Ad Categories (Max 20)</h3>
  <Select
    isMulti
    options={adCategoryOptions}
    value={adCategoryOptions.filter(option => profile.adCategories?.includes(option.value))}
    onChange={(selectedOptions) => handleSelectChange(selectedOptions, "adCategories")}
    className="w-full"
    styles={{
      control: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        borderColor: "#272727",
        color: "white",
        minHeight: "40px",
      }),
      input: (provided) => ({
        ...provided,
        color: "white",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        color: "white",
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#333",
        color: "white",
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1E1E1E" : "#272727",
        color: "white",
        ":hover": {
          backgroundColor: "#1E1E1E",
        },
      }),
    }}
  />
  <p className="text-gray-400 text-xs mt-1">
    Select categories you can post ads for
  </p>
  <div className="flex flex-wrap gap-2 mt-2">
    {adCategoryOptions
      .filter(option => !profile.adCategories?.includes(option.value))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(option => (
        <button
          key={option.value}
          onClick={() => handleButtonClick(option.value, "adCategories")}
          disabled={profile.adCategories?.length >= 20}
          className={`px-3 py-1 text-xs rounded-full ${
            profile.adCategories?.length >= 20 
              ? "bg-[#222] text-gray-500 cursor-not-allowed" 
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          } transition-colors`}
        >
          + {option.label}
        </button>
      ))}
  </div>
</div>

<div className="w-full">
  <h3 className="text-white font-medium mb-2">Page Content Category (Max 20)</h3>
  <Select
    isMulti
    options={pageContentCategoryOptions}
    value={pageContentCategoryOptions.filter(option => profile.pageContentCategory?.includes(option.value))}
    onChange={(selectedOptions) => handleSelectChange(selectedOptions, "pageContentCategory")}
    className="w-full"
    styles={{
      control: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        borderColor: "#272727",
        color: "white",
        minHeight: "40px",
      }),
      input: (provided) => ({
        ...provided,
        color: "white",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        color: "white",
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#333",
        color: "white",
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1E1E1E" : "#272727",
        color: "white",
        ":hover": {
          backgroundColor: "#1E1E1E",
        },
      }),
    }}
  />
  <p className="text-gray-400 text-xs mt-1">
    Select your page's main content categories
  </p>
  <div className="flex flex-wrap gap-2 mt-2">
    {pageContentCategoryOptions
      .filter(option => !profile.pageContentCategory?.includes(option.value))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(option => (
        <button
          key={option.value}
          onClick={() => handleButtonClick(option.value, "pageContentCategory")}
          disabled={profile.pageContentCategory?.length >= 20}
          className={`px-3 py-1 text-xs rounded-full ${
            profile.pageContentCategory?.length >= 20 
              ? "bg-[#222] text-gray-500 cursor-not-allowed" 
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          } transition-colors`}
        >
          + {option.label}
        </button>
      ))}
  </div>
</div>

<div className="w-full">
  <h3 className="text-white font-medium mb-2">Average Audience Type</h3>
  <Select
    isMulti
    options={audienceTypeOptions}
    value={audienceTypeOptions.filter(option => profile.averageAudienceType?.includes(option.value))}
    onChange={(selectedOptions) => setProfile({
      ...profile,
      averageAudienceType: selectedOptions.map(option => option.value)
    })}
    className="w-full"
    styles={{
      control: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        borderColor: "#272727",
        color: "white",
        minHeight: "40px",
      }),
      input: (provided) => ({
        ...provided,
        color: "white",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "#272727",
        color: "white",
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#333",
        color: "white",
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "white",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#1E1E1E" : "#272727",
        color: "white",
        ":hover": {
          backgroundColor: "#1E1E1E",
        },
      }),
    }}
  />
  <div className="flex flex-wrap gap-2 mt-2">
    {audienceTypeOptions
      .filter(option => !profile.averageAudienceType?.includes(option.value))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(option => (
        <button
          key={option.value}
          onClick={() => setProfile({
            ...profile,
            averageAudienceType: [...(profile.averageAudienceType || []), option.value]
          })}
          className="px-3 py-1 text-xs rounded-full bg-[#333] text-gray-300 hover:bg-[#444] transition-colors"
        >
          + {option.label}
        </button>
      ))}
  </div>
</div>

<div className="w-full">
  <h3 className="text-white font-medium mb-2">Average Audience Location</h3>
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      id="audience-location-input"
      placeholder="Type audience locations"
      className="w-full px-3 py-2 rounded bg-[#272727] border border-[#272727] text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
          addLocation(e.target.value.trim());
          e.target.value = '';
        }
      }}
    />
    <button
      onClick={() => {
        const input = document.getElementById('audience-location-input');
        if (input.value.trim()) {
          addLocation(input.value.trim());
          input.value = '';
        }
      }}
      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition whitespace-nowrap"
    >
      Add
    </button>
  </div>
  
  <div className="flex flex-wrap gap-2 mt-2">
    {profile.averageLocationOfAudience?.map((location, index) => (
      <div key={index} className="flex items-center px-3 py-1 text-xs rounded-full bg-[#333] text-gray-300">
        {location}
        <button 
          onClick={() => removeLocation(index)}
          className="ml-2 text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>
        {/* Pricing Section */}
        <div className="w-full bg-[#272727] p-4 rounded-lg">
          <h3 className="text-white font-medium mb-3">Approx Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-300 text-sm">Story Post</label>
              <div className="flex items-center mt-1">
                <span className="bg-[#1E1E1E] text-white p-2 rounded-l">₹</span>
                <input
                  type="number"
                  value={pricingStructure.storyPost}
                  onChange={(e) => handlePricingChange("storyPost", e.target.value)}
                  className="flex-1 w-40 p-2 bg-[#1E1E1E] text-white rounded-r"
                  placeholder="Amount"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm">Feed Post</label>
              <div className="flex items-center mt-1">
                <span className="bg-[#1E1E1E] text-white p-2 rounded-l">₹</span>
                <input
                  type="number"
                  value={pricingStructure.feedPost}
                  onChange={(e) => handlePricingChange("feedPost", e.target.value)}
                  className="flex-1 w-40 p-2 bg-[#1E1E1E] text-white rounded-r"
                  placeholder="Amount"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm">Reel</label>
              <div className="flex items-center mt-1">
                <span className="bg-[#1E1E1E] text-white p-2 rounded-l">₹</span>
                <input
                  type="number"
                  value={pricingStructure.reel}
                  onChange={(e) => handlePricingChange("reel", e.target.value)}
                  className="flex-1 w-40 p-2 bg-[#1E1E1E] text-white rounded-r"
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Profile Details */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium">Social Media Accounts</h3>
            <button 
              onClick={addProfileDetail}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              + Add Account
            </button>
          </div>

          {profile.profileDetails?.map((detail, index) => (
            <div key={index} className="border-[#1E1E1E] p-4 mb-4 bg-[#272727] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-gray-300 text-sm">Platform</label>
                  <select
                    value={detail.platform || ""}
                    disabled={detail.verified}
                    onChange={(e) => handleProfileDetailChange(index, "platform", e.target.value)}
                    className={`w-full p-2 mt-1 bg-[#1E1E1E] text-white rounded ${
                      detail.verified ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    <option value="">Select Platform</option>
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm">Profile Name</label>
                  <input
                    type="text"
                    placeholder="e.g., @username"
                    value={detail.profileName || ""}
                    disabled={detail.verified}
                    onChange={(e) => handleProfileDetailChange(index, "profileName", e.target.value)}
                    className={`w-full p-2 mt-1 bg-[#1E1E1E] text-white rounded ${
                      detail.verified ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-gray-300 text-sm">Profile URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={detail.profilePicUrl || ""}
                    disabled={detail.verified}
                    onChange={(e) => handleProfileDetailChange(index, "profilePicUrl", e.target.value)}
                    className={`w-full p-2 mt-1 bg-[#1E1E1E] text-white rounded ${
                      detail.verified ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm">Dashboard Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={detail.profileDashboardPic || ""}
                    onChange={(e) => handleProfileDetailChange(index, "profileDashboardPic", e.target.value)}
                    className="w-full p-2 mt-1 bg-[#1E1E1E] text-white rounded"
                  />
                </div>
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-gray-300 text-sm">Followers</label>
                  <input
                    type="number"
                    placeholder="Number of followers"
                    value={detail.followers || ""}
                    disabled={detail.verified}
                    onChange={(e) => handleProfileDetailChange(index, "followers", e.target.value)}
                    className="w-full p-2 mt-1 bg-[#1E1E1E] text-white rounded"
                  />
                </div>

                <button
                  onClick={() => removeAccount(index)}
                  className="bg-[#1E1E1E] hover:bg-[#2B2B2B] text-red-500 p-2 rounded h-[40px] flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {detail.verified && (
                <div className="mt-2 text-green-400 text-sm">
                  ✓ This account is verified
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;