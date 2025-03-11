import Select from "react-select";
import { Trash2 } from "lucide-react";


const AccountDetails = ({ profile, setProfile }) => {
  const platforms = ["Instagram", "Facebook", "Twitter", "YouTube", "WhatsApp"];
  
  const adCategoryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Health", label: "Health" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Sports", label: "Sports" },
    { value: "Business", label: "Business" },
  ];
  
  const suggestedCategories = ["Business", "Marketing", "AI", "E-commerce", "Gaming"];
  
  const pageContentCategoryOptions = [
    { value: "Entertainment", label: "Entertainment" },
    { value: "Business", label: "Business" },
    { value: "Gaming", label: "Gaming" },
    { value: "Science", label: "Science" },
    { value: "Travel", label: "Travel" },
  ];
  
  const suggestedContentCategories = ["Entertainment", "Marketing", "AI", "E-commerce", "Gaming"];

  const removeAccount = (index) => {
    const updatedDetails = profile.profileDetails.filter((_, i) => i !== index);
    setProfile({ ...profile, profileDetails: updatedDetails });
  };

  const handleSelectChange = (selectedOptions, field) => {
    const limitedSelection = selectedOptions.slice(0, 3);
    setProfile({
      ...profile,
      [field]: limitedSelection.map((option) => option.value),
    });
  };

  const handleButtonClick = (category, field) => {
    if (!profile[field]?.includes(category) && (profile[field]?.length || 0) < 3) {
      setProfile({
        ...profile,
        [field]: [...(profile[field] || []), category],
      });
    }
  };

  const handleProfileDetailChange = (index, field, value) => {
    const updatedDetails = [...profile.profileDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setProfile({ ...profile, profileDetails: updatedDetails });
  };

  const addProfileDetail = () => {
    setProfile({
      ...profile,
      profileDetails: [
        ...profile.profileDetails,
        { platform: "", profileName: "", profilePicUrl: "", followers: "" },
      ],
    });
  };
  
  return (
    <div className="w-full h-full bg-[#151515] p-5 shadow-md flex flex-col items-center">
      <h2 className="text-xm mb-6 text-[#FFFFFF] self-start">Account Details</h2>

      {/* Ad Categories Selection */}
      <div className="gap-6 w-[90%] flex flex-col items-center">
        <h3 className="text-white font-medium mt-4 self-start">Select your Account Category</h3>
        <Select
          isMulti
          options={adCategoryOptions}
          value={adCategoryOptions.filter(option => profile.adCategories?.includes(option.value))}
          onChange={(selectedOptions) => handleSelectChange(selectedOptions, "adCategories")}
          className="w-full h-10"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "black",
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
              backgroundColor: state.isSelected ? "black" : "black",
              color: "white",
            }),
          }}
        />

        {/* Suggested Categories for Ad Categories */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {suggestedCategories
            .filter(category => !profile.adCategories?.includes(category))
            .map(category => (
              <button
                key={category}
                className="px-3 py-1 rounded-2xl bg-[#272727] text-[#939393]"
                onClick={() => handleButtonClick(category, "adCategories")}
                disabled={profile.adCategories?.length >= 3}
              >
                + {category}
              </button>
            ))}
        </div>

        {/* Page Content Category Selection */}
        <h3 className="text-white font-medium mt-4 self-start">Select Page Content Category</h3>
        <Select
          isMulti
          options={pageContentCategoryOptions}
          value={pageContentCategoryOptions.filter(option => profile.pageContentCategory?.includes(option.value))}
          onChange={(selectedOptions) => handleSelectChange(selectedOptions, "pageContentCategory")}
          className="w-full h-10"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "black",
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
              backgroundColor: state.isSelected ? "black" : "black",
              color: "white",
            }),
          }}
        />

        {/* Suggested Categories for Page Content */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {suggestedContentCategories
            .filter(category => !profile.pageContentCategory?.includes(category))
            .map(category => (
              <button
                key={category}
                className="px-3 py-1 rounded-2xl bg-[#272727] text-[#939393]"
                onClick={() => handleButtonClick(category, "pageContentCategory")}
                disabled={profile.pageContentCategory?.length >= 3}
              >
                + {category}
              </button>
            ))}
        </div>
      </div>

      {/* Social Media Profile Details */}
      <div className="mt-4 w-[100%] flex flex-col items-center">
        <h3 className="text-white font-medium self-start">Add Social Media Account</h3>
        {profile.profileDetails?.map((detail, index) => (
          <div key={index} className="border-[#272727] p-3 mb-5 bg-[#272727] rounded w-full">
            <select
              value={detail.platform || ""}
              onChange={(e) => handleProfileDetailChange(index, "platform", e.target.value)}
              className="w-full p-2 border-black bg-black mb-3 text-white rounded"
            >
              <option value="">Select Platform</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Profile Name"
              value={detail.profileName || ""}
              onChange={(e) => handleProfileDetailChange(index, "profileName", e.target.value)}
              className="w-full p-2 border-black bg-black mb-3 text-white rounded"
            />
            <input
              type="text"
              placeholder="Profile Link"
              value={detail.profilePicUrl || ""}
              onChange={(e) => handleProfileDetailChange(index, "profilePicUrl", e.target.value)}
              className="w-full p-2 border-black bg-black mb-3 text-white rounded"
              required
            />
           <div className="flex items-center w-full">
              {/* Input Field */}
              <input
                type="text"
                placeholder="Followers"
                value={detail.followers || ""}
                onChange={(e) => handleProfileDetailChange(index, "followers", e.target.value)}
                className="flex-1 h-10 p-2 border border-black rounded bg-black text-white"
              />

              {/* Delete Button */}
              <button
                onClick={() => removeAccount(index)}
                className="bg-[#2B2B2B] text-red h-10 px-1 py-2 rounded flex items-center justify-center"
              >
                <Trash2 size={25} stroke="red" />
              </button>
            </div>
          </div>
        ))}
        <button onClick={addProfileDetail} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
          Add Profile Detail
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
