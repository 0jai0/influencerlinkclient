const PastPosts = ({ profile, setProfile }) => {
    const addPastPost = () => {
      setProfile({
        ...profile,
        pastPosts: [
          ...profile.pastPosts,
          { category: "", postLink: "", platform: "" },
        ],
      });
    };
  
    const handlePastPostChange = (index, field, value) => {
      const updatedPosts = [...profile.pastPosts];
      updatedPosts[index] = { ...updatedPosts[index], [field]: value };
      setProfile({ ...profile, pastPosts: updatedPosts });
    };
  
    return (
      <div className="w-full h-full bg-[#151515] p-5 shadow-md">
        <h2>Past Posts</h2>
        {profile.pastPosts.map((post, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Category"
              value={post.category}
              onChange={(e) =>
                handlePastPostChange(index, "category", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Post Link"
              value={post.postLink}
              onChange={(e) =>
                handlePastPostChange(index, "postLink", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Platform"
              value={post.platform}
              onChange={(e) =>
                handlePastPostChange(index, "platform", e.target.value)
              }
            />
          </div>
        ))}
        <button onClick={addPastPost}>Add Post</button>
      </div>
    );
  };
  
  export default PastPosts;
  