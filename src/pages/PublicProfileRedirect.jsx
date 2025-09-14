import React, { useEffect } from "react";

const PublicProfileRedirect = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const name = params.get("name");

    // Construct your deep link
    const deepLink = `PromoterLink://PublicProfile?userId=${userId}&name=${name}`;

    // Try opening the app
    window.location.href = deepLink;

    // Optional fallback: if app not installed, redirect to App Store / Play Store
    setTimeout(() => {
      window.location.href = "https://play.google.com/store/apps/details?id=com.mjvkiran1027.MeatScroll"; // replace with actual store link
    }, 2000);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>Opening PromoterLink App...</h2>
      <p>If nothing happens, <a href="https://play.google.com/store/apps/details?id=com.mjvkiran1027.MeatScroll">click here</a> to download the app.</p>
    </div>
  );
};

export default PublicProfileRedirect;
