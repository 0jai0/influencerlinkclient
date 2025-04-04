import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const platformOptions = [
  { value: 'Instagram', label: 'Instagram', dimensions: { width: 1080, height: 1080 }, aspectRatio: 9/12, icon: '📷' },
  { value: 'Facebook', label: 'Facebook', dimensions: { width: 1200, height: 630 }, aspectRatio: 1200/630, icon: '👍' },
  { value: 'Twitter', label: 'Twitter', dimensions: { width: 1200, height: 675 }, aspectRatio: 16/9, icon: '🐦' },
  { value: 'YouTube', label: 'YouTube', dimensions: { width: 1280, height: 720 }, aspectRatio: 16/9, icon: '▶️' },
  { value: 'WhatsApp', label: 'WhatsApp', dimensions: { width: 1280, height: 720 }, aspectRatio: 16/9, icon: '💬' },
];

const PastPosts = ({ profile, setProfile }) => {
  const [expandedPost, setExpandedPost] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cropping, setCropping] = useState(null);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const fileInputRef = useRef(null);
  const cropperRef = useRef(null);

  // Add a new empty post
  const addPastPost = () => {
    setProfile({
      ...profile,
      pastPosts: [
        { 
          category: "", 
          postLink: "", 
          platform: "Instagram",
          // Temporary client-side only fields (not saved to DB)
          _imageFile: null,
          _originalImage: null,
          _dimensions: platformOptions.find(p => p.value === "Instagram")?.dimensions
        },
        ...profile.pastPosts,
      ],
    });
    setExpandedPost(0);
  };

  // Handle changes to post fields
  const handlePastPostChange = (index, field, value) => {
    const updatedPosts = [...profile.pastPosts];
    updatedPosts[index] = { 
      ...updatedPosts[index], 
      [field]: value,
      // Update dimensions when platform changes
      ...(field === 'platform' ? { 
        _dimensions: platformOptions.find(p => p.value === value)?.dimensions 
      } : {})
    };
    setProfile({ ...profile, pastPosts: updatedPosts });
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    setUploading(true);
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
      //console.log(data);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };
  
  // Handle image selection (shows cropper but doesn't upload yet)
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Show the original image for cropping
    const reader = new FileReader();
    reader.onload = () => {
      const updatedPosts = [...profile.pastPosts];
      updatedPosts[index] = { 
        ...updatedPosts[index], 
        _imageFile: file,
        _originalImage: reader.result
      };
      setProfile({ ...profile, pastPosts: updatedPosts });
      setCropping(index);
    };
    reader.readAsDataURL(file);
  };
  
  // Crop image and upload to Cloudinary
  const cropImage = async (index) => {
    if (!cropperRef.current) return;
  
    const cropper = cropperRef.current.cropper;
    const canvas = cropper.getCroppedCanvas({
      width: profile.pastPosts[index]._dimensions?.width,
      height: profile.pastPosts[index]._dimensions?.height
    });
    
    if (!canvas) return;
  
    setUploading(true);
    
    try {
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        try {
          // Upload the cropped image
          const imageUrl = await uploadImageToCloudinary(blob);
          
          // Update the post with the new image URL
          const updatedPosts = [...profile.pastPosts];
          updatedPosts[index] = { 
            ...updatedPosts[index], 
            postLink: imageUrl,
            _originalImage: null // Clear the temporary original image
          };
          
          setProfile({ ...profile, pastPosts: updatedPosts });
          setCropping(null);
        } catch (error) {
          console.error("Error uploading cropped image:", error);
        } finally {
          setUploading(false);
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error("Error cropping image:", error);
      setUploading(false);
    }
  };
  
  // Cancel cropping
  const cancelCrop = () => {
    const index = cropping;
    const updatedPosts = [...profile.pastPosts];
    updatedPosts[index] = { 
      ...updatedPosts[index], 
      _imageFile: null,
      _originalImage: null
    };
    setProfile({ ...profile, pastPosts: updatedPosts });
    setCropping(null);
  };

  

  // Remove post
  const removePost = (index) => {
    const updatedPosts = profile.pastPosts.filter((_, i) => i !== index);
    setProfile({ ...profile, pastPosts: updatedPosts });
    if (expandedPost === index) setExpandedPost(null);
  };

  // Toggle post expansion
  const toggleExpandPost = (index) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const foundPlatform = platformOptions.find(p => p.value === platform);
    return foundPlatform ? foundPlatform.icon : '🌐';
  };

  // Trigger file input
  const triggerFileInput = (index) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.index = index;
      fileInputRef.current.click();
    }
  };

  // Get platform aspect ratio
  const getPlatformAspectRatio = (platform) => {
    const foundPlatform = platformOptions.find(p => p.value === platform);
    return foundPlatform ? foundPlatform.aspectRatio : 1;
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(profile.pastPosts.map(post => post.category).filter(Boolean))];

  // Filter posts based on selected filters
  const filteredPosts = profile.pastPosts.filter(post => {
    const platformMatch = filterPlatform === 'all' || post.platform === filterPlatform;
    const categoryMatch = !filterCategory || post.category.toLowerCase().includes(filterCategory.toLowerCase());
    return platformMatch && categoryMatch;
  });
 
  return (
    <div className="w-[100%] bg-[#151515] p-4 md:p-6 rounded-lg shadow-lg">
      <div className="flex  mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Past Posts</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Platform Filter */}
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-400 mb-1">
              Filter by Platform
            </label>
            <select
              id="platform-filter"
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full bg-[#333] border border-[#444] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Platforms</option>
              {platformOptions.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div className="flex-1 min-w-[150px]">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-400 mb-1">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-[#333] border border-[#444] text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Add Post Button */}
          <div className="self-end">
            <button 
              onClick={addPastPost}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition flex items-center text-sm md:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="">Add Post</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => {
          const index = parseInt(e.target.dataset.index);
          handleImageUpload(index, e);
          e.target.value = '';
        }}
        accept="image/*"
        className="hidden"
      />
      
      {/* Image Cropping Modal */}
      {cropping !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#252525] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Crop Image for {profile.pastPosts[cropping].platform}</h3>
              <div className="mb-4">
                <p className="text-gray-300">
                  Recommended size: {profile.pastPosts[cropping]._dimensions?.width}×
                  {profile.pastPosts[cropping]._dimensions?.height}px
                </p>
              </div>
              <div className="relative w-full h-64 md:h-96">
                <Cropper
                  ref={cropperRef}
                  src={profile.pastPosts[cropping]._originalImage}
                  aspectRatio={getPlatformAspectRatio(profile.pastPosts[cropping].platform)}
                  viewMode={1}
                  guides={true}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <button
                  onClick={cancelCrop}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => cropImage(cropping)}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center justify-center"
                >
                  {uploading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No posts match your filters. Try adjusting your filters or add a new post.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => (
            <div key={index} className="bg-[#252525] rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 md:p-4 cursor-pointer"
                onClick={() => toggleExpandPost(index)}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <span className="text-xl">{getPlatformIcon(post.platform)}</span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-200 truncate">
                      {post.category || "Untitled Post"}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 truncate">
                      {post.platform}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.postLink && (
                    <a 
                      href={post.postLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs md:text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </a>
                  )}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${expandedPost === index ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {expandedPost === index && (
                <div className="p-3 md:p-4 border-t border-[#333]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Post Preview */}
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-[#333] rounded-md overflow-hidden mb-2 relative"
                        style={{
                          aspectRatio: `${getPlatformAspectRatio(post.platform)}`
                        }}>
                        {post.postLink ? (
                          <img 
                            src={post.postLink} 
                            alt="Post preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No image uploaded
                          </div>
                        )}
                        {uploading && cropping === index && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-2">
                        {post._dimensions?.width}×{post._dimensions?.height}px
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => triggerFileInput(index)}
                          disabled={uploading}
                          className="px-2 py-1 md:px-3 md:py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs md:text-sm transition"
                        >
                          {post.postLink ? 'Change' : 'Upload'}
                        </button>
                        {post.postLink && (
                          <a 
                            href={post.postLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 md:px-3 md:py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs md:text-sm transition"
                          >
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Post Details */}
                    <div className="space-y-3 md:space-y-4">
                      <div className="space-y-1 md:space-y-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-400">
                          Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Fashion, Food, Travel"
                          value={post.category}
                          onChange={(e) => handlePastPostChange(index, "category", e.target.value)}
                          className="w-full bg-[#333] border border-[#444] text-white rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-1 md:space-y-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-400">
                          Platform
                        </label>
                        <select
                          value={post.platform}
                          onChange={(e) => handlePastPostChange(index, "platform", e.target.value)}
                          className="w-full bg-[#333] border border-[#444] text-white rounded-md px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {platformOptions.map(platform => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label} ({platform.dimensions.width}×{platform.dimensions.height})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => removePost(index)}
                        className="w-full px-3 py-1 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-xs md:text-sm"
                      >
                        Remove Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastPosts;