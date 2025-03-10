import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const platforms = ["Instagram", "Facebook", "Twitter", "YouTube", "WhatsApp"];

const EditPage = () => {
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
  const [imageToCrop, setImageToCrop] = useState(null); // Image to be cropped
  const [croppingIndex, setCroppingIndex] = useState(null); // Index of the past post being edited
  const [cropper, setCropper] = useState(null); // Cropper instance

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/pageowners/user/${user?.id}`
        );
        if (!response.ok) {
          throw new Error("User not found");
        }
        const data = await response.json();
        console.log(data.data, "dg");
        setUser1(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [user?.id]);

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate, isAuthenticated, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    setProfile({ ...profile, [field]: e.target.value.split(",") });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      pricing: { ...profile.pricing, [name]: value },
    });
  };

  const handleCheckboxChange = (platform) => {
    setProfile((prev) => {
      const updatedPlatforms = prev.socialMediaPlatforms.includes(platform)
        ? prev.socialMediaPlatforms.filter((p) => p !== platform)
        : [...prev.socialMediaPlatforms, platform];
      return { ...prev, socialMediaPlatforms: updatedPlatforms };
    });
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

  const handlePastPostChange = (index, field, value) => {
    const updatedPosts = [...profile.pastPosts];
    updatedPosts[index] = { ...updatedPosts[index], [field]: value };
    setProfile({ ...profile, pastPosts: updatedPosts });
    console.log("Past Posts After Update:", updatedPosts); // Debugging
  };

  const addPastPost = () => {
    setProfile({
      ...profile,
      pastPosts: [
        ...profile.pastPosts,
        { category: "", postLink: "", platform: "" },
      ],
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "influencerlink");

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
      console.log("Uploaded Image URL:", data.secure_url); // Debugging
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const handleFileSelect = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result); // Set image for cropping
        setCroppingIndex(index); // Store the index of the past post being edited
        console.log("Cropping Index:", index); // Debugging
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImageNow = async () => {
    if (cropper) {
      // Get the cropped image as a Blob
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (blob) {
          setLoading(true);
          try {
            const file = new File([blob], `cropped-image-${Date.now()}.png`, {
              type: "image/png",
            });
            const imageUrl = await uploadImageToCloudinary(file);

            // Update the pastPosts array with the new image URL
            const updatedPosts = [...profile.pastPosts];
            updatedPosts[croppingIndex] = {
              ...updatedPosts[croppingIndex],
              postLink: imageUrl,
            };
            setProfile({ ...profile, pastPosts: updatedPosts });

            console.log("Past Posts After Update:", updatedPosts); // Debugging
          } catch (error) {
            alert("Failed to upload image. Please try again.");
          } finally {
            setLoading(false);
            setImageToCrop(null); // Close the cropping interface
          }
        }
      }, "image/png");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("Profile Data Being Sent:", profile); // Debugging

    try {
      if (!user?.id) {
        throw new Error("User ID is missing");
      }

      const response = await axios.put(
        `http://localhost:5000/api/pageowners/updateUser/${user?.id}`,
        profile,
        { withCredentials: true }
      );

      if (response.data) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update Error:", error); // Debugging
      alert(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      {loading ? (
        <p>Checking authentication...</p>
      ) : isAuthenticated ? (
        <p>Welcome, User ID: {user1?.id}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <label>Profile Picture:</label>
        {profile.profilePicUrl && (
          <img
            src={profile.profilePicUrl}
            alt="Profile"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e)}
        />
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={profile.ownerName || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="whatsapp"
          placeholder="WhatsApp"
          value={profile.whatsapp || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block font-semibold">Social Media Platforms:</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <label key={platform} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={profile.socialMediaPlatforms.includes(platform)}
                  onChange={() => handleCheckboxChange(platform)}
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
        </div>

        <input
          type="text"
          name="adCategories"
          placeholder="Ad Categories (comma separated)"
          value={profile.adCategories?.join(",") || ""}
          onChange={(e) => handleArrayChange(e, "adCategories")}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="pageContentCategory"
          placeholder="Page Content Category (comma separated)"
          value={profile.pageContentCategory?.join(",") || ""}
          onChange={(e) => handleArrayChange(e, "pageContentCategory")}
          className="w-full p-2 border rounded"
        />

        <h3 className="font-bold mt-4">Profile Details</h3>
        {(profile.profileDetails || []).map((detail, index) => (
          <div key={index} className="border p-2 rounded">
            <select
              value={detail.platform || ""}
              onChange={(e) =>
                handleProfileDetailChange(index, "platform", e.target.value)
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select Platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Profile Name"
              value={detail.profileName || ""}
              onChange={(e) =>
                handleProfileDetailChange(index, "profileName", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Profile Pic URL"
              value={detail.profilePicUrl || ""}
              onChange={(e) =>
                handleProfileDetailChange(
                  index,
                  "profilePicUrl",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Followers"
              value={detail.followers || ""}
              onChange={(e) =>
                handleProfileDetailChange(index, "followers", e.target.value)
              }
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addProfileDetail}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Profile Detail
        </button>

        <h3 className="font-bold mt-4">Past Posts</h3>
        {profile.pastPosts.map((post, index) => (
          <div key={index} className="border p-2 rounded">
            <input
              type="text"
              placeholder="Category"
              value={post.category || ""}
              onChange={(e) =>
                handlePastPostChange(index, "category", e.target.value)
              }
              className="w-full p-2 border rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(index, e)}
              className="w-full p-2 border rounded"
            />
            {imageToCrop && croppingIndex === index && (
              <div>
                <Cropper
                  src={imageToCrop}
                  style={{ height: 400, width: "100%" }} // Fixed height and width for the Cropper container
                  aspectRatio={4 / 5.9} // Fixed aspect ratio for the cropping frame (e.g., 16:9)
                  guides={true} // Show guides within the cropping frame
                  viewMode={2} // Constrain the cropping box to the container size
                  dragMode="move" // Allow dragging to move the image
                  zoomable={true} // Allow zooming in and out
                  zoomOnTouch={true} // Enable zooming on touch devices
                  zoomOnWheel={true} // Enable zooming with the mouse wheel
                  cropBoxResizable={true} // Disable resizing the cropping box
                  cropBoxMovable={true} // Disable moving the cropping box
                  minCropBoxWidth={200} // Minimum width of the cropping box
                  minCropBoxHeight={400} // Minimum height of the cropping box
                  background={false} // Hide the background outside the cropping box
                  autoCropArea={1} // Automatically crop the entire image initially
                  onInitialized={(instance) => setCropper(instance)} // Initialize the Cropper instance
                />
                <button
                  onClick={cropImageNow}
                  className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
                >
                  Crop and Upload
                </button>
              </div>
            )}

            {post.postLink && (
              <img
                src={post.postLink}
                alt="Uploaded preview"
                className="w-32 h-48 object-cover mt-2"
              />
            )}

            <select
              value={post.platform || ""}
              onChange={(e) =>
                handlePastPostChange(index, "platform", e.target.value)
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select Platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={addPastPost}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Past Post
        </button>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditPage;
