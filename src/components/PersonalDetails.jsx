import { useState } from "react";

const PersonalDetails = ({ profile, setProfile }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const uploadImageToCloudinary = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "influencerlink"); // Replace with your actual preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djazdvcrn/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Uploaded Image URL:", data.secure_url);

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(file);
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicUrl: uploadedImageUrl, // Set Cloudinary image URL
        }));
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#151515] p-5 shadow-md flex flex-col items-center">
      <h2 className="text-xm mb-6 text-[#FFFFFF] self-start">Personal Details</h2>

      {/* Main Container */}
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
        {/* Image Upload Section - At the top for mobile, right for tablet/desktop */}
        <div className="order-1 md:order-2 flex flex-col gap-4 items-center justify-center w-full md:w-5/12">
          <div className="w-[150px] h-[150px] bg-[#272727] rounded-md flex items-center justify-center relative">
            {/* Show loading spinner while image is uploading */}
            {loading ? (
              <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            ) : profile.profilePicUrl ? (
              <img
                src={profile.profilePicUrl}
                alt="Profile Pic"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-gray-400 text-6xl">+</span>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="fileInput"
            disabled={loading} // Disable file input while loading
          />
          <span className="text-gray-400 text-sm">
            {loading ? "Uploading..." : "Update Profile Pic"}
          </span>
          {/* Label acting as a button */}
          <label
            htmlFor="fileInput"
            className={`px-4 py-2 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-black cursor-pointer"
            } text-white rounded-3xl text-sm`}
          >
            {loading ? "Uploading..." : "Choose File"}
          </label>
        </div>

        {/* Input Fields Section - At the bottom for mobile, left for tablet/desktop */}
        <div className="order-2 md:order-1 flex flex-col gap-4 w-full md:w-7/12">
          <input
            type="text"

            name="ownerName"
            value={profile.ownerName}
            onChange={handleChange}
            placeholder="Insta or YouTube Username"
            className="w-full p-2 border border-black rounded-md bg-black text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            disabled={true}
            value={profile.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-black rounded-md bg-black text-white placeholder-gray-400"
          />
          <input
            type="text"
            name="mobile"
            value={profile.mobile}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border border-black rounded-md bg-black text-white placeholder-gray-400"
          />
          {/* Description Field */}
          <textarea
            name="description"
            value={profile.description || ""}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full h-20 p-2 border border-black rounded-md bg-black text-white placeholder-gray-400 resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;