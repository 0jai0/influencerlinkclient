import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useSelector } from "react-redux";

const Dashboard = () => {
  const [pageOwners, setPageOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  useEffect(() => {
    const fetchPageOwners = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/pageowners/users"
        );
        console.log("Response Data:", response.data);
        setPageOwners(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchPageOwners();
  }, []);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const userId = user?.id;
  console.log(userId);

  // Flatten past posts from all owners
  const allPastPosts = Array.isArray(pageOwners) ? pageOwners.flatMap(owner => owner.pastPosts || []) : [];

  // Extract unique categories and platforms for dropdowns
  const categories = [
    "All",
    ...new Set(allPastPosts.map((post) => post.category)),
  ];
  const platforms = [
    "All",
    ...new Set(allPastPosts.map((post) => post.platform)),
  ];

  // Filter posts based on selected category and platform
  const filteredPosts = allPastPosts.filter(
    (post) =>
      (selectedCategory === "All" || post.category === selectedCategory) &&
      (selectedPlatform === "All" || post.platform === selectedPlatform)
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {loading ? (
        <p>Checking authentication...</p>
      ) : isAuthenticated ? (
        <p>Welcome, User ID: {userId}</p>
      ) : (
        <p>You are not logged in.</p>
      )}
      <h2>Page Owners</h2>
      {pageOwners.length === 0 ? (
        <p>No page owners found.</p>
      ) : (
        pageOwners.map((owner) => (
          <div
            key={owner._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{owner.ownerName}</h3>
            <p>
              <strong>Email:</strong> {owner.email}
            </p>
            <p>
              <strong>Mobile:</strong> {owner.mobile}
            </p>
            <p>
              <strong>WhatsApp:</strong> {owner.whatsapp || "N/A"}
            </p>
            <h4>Social Media Platforms:</h4>
            <ul>
              {owner.socialMediaPlatforms.map((platform, index) => (
                <li key={index}>{platform}</li>
              ))}
            </ul>

            <h4>Profile Details:</h4>
            {owner.profileDetails.length > 0 ? (
              owner.profileDetails.map((profile, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  <p>
                    <strong>Platform:</strong> {profile.platform}
                  </p>
                  <p>
                    <strong>Profile Name:</strong>{" "}
                    {profile.profileName || "N/A"}
                  </p>
                  <p>
                    <strong>Followers:</strong> {profile.followers || "N/A"}
                  </p>
                  <p>
                    <strong>Verified:</strong> {profile.verified ? "Yes" : "No"}
                  </p>
                  {profile.profilePicUrl && (
                    <img
                      src={profile.profilePicUrl}
                      alt={profile.profileName}
                      width="100"
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No profile details available.</p>
            )}

            <h4>Ad Categories:</h4>
            <p>{owner.adCategories.join(", ") || "N/A"}</p>

            <h4>Page Content Categories:</h4>
            <p>{owner.pageContentCategory.join(", ") || "N/A"}</p>

            <h4>Pricing:</h4>
            <p>
              <strong>Story Post:</strong> ${owner.pricing?.storyPost ?? "N/A"}
            </p>
            <p>
              <strong>Feed Post:</strong> ${owner.pricing?.feedPost ?? "N/A"}
            </p>
            <p>
              <strong>Reel:</strong> ${owner.pricing?.reel ?? "N/A"}
            </p>

            <h4>Past Posts:</h4>

            {/* Category and Platform Filters */}
            <div className="mb-4">
              <label className="mr-2">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label className="ml-4 mr-2">Platform:</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                {platforms.map((platform, index) => (
                  <option key={index} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
            {/* Display Filtered Posts */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <div key={index} className="mb-4">
                  <p>
                    <strong>Category:</strong> {post.category}
                  </p>
                  <p>
                    <strong>Platform:</strong> {post.platform}
                  </p>

                  {/* Instagram Embed */}
                  {post.platform === "Instagram" &&
                  post.postLink.includes("/p/") ? (
                    <div>
                      <iframe
                        src={`https://www.instagram.com/p/${
                          post.postLink.split("/p/")[1].split("/")[0]
                        }/embed`}
                        width="400"
                        height="400"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null}

                  {/* Facebook Embed */}
                  {post.platform === "Facebook" &&
                  post.postLink.includes("facebook.com") ? (
                    <div>
                      <iframe
                        src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
                          post.postLink
                        )}&show_text=false`}
                        width="400"
                        height="400"
                        style={{ border: "none", overflow: "hidden" }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null}

                  {/* Twitter (X) Embed */}
                  {post.platform === "Twitter" &&
                  post.postLink.includes("twitter.com") ? (
                    <blockquote className="twitter-tweet">
                      <a
                        href={post.postLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Tweet
                      </a>
                    </blockquote>
                  ) : null}

                  {/* Threads Embed */}
                  {post.platform === "Threads" &&
                  post.postLink.includes("threads.net") ? (
                    <div>
                      <iframe
                        src={post.postLink}
                        width="400"
                        height="400"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null}

                  {/* Telegram & WhatsApp (Google Drive Links) */}
                  {["Telegram", "WhatsApp"].includes(post.platform) &&
                  post.postLink.includes("drive.google.com") ? (
                    <a
                      href={post.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View File on Google Drive
                    </a>
                  ) : null}

                  {/* Default link for unsupported platforms */}
                  {![
                    "Instagram",
                    "Facebook",
                    "Twitter",
                    "Threads",
                    "Telegram",
                    "WhatsApp",
                    "Google Drive",
                  ].includes(post.platform) && (
                    <a
                      href={post.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      View Post
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p>No posts available for the selected category and platform.</p>
            )}

            <p>
              <strong>Created At:</strong>{" "}
              {new Date(owner.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
