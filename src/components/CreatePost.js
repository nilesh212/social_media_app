import { useState } from "react";
import styles from "../styles/home.module.css";
import { addFriend } from "../api";
import { usePosts } from "../hooks";

function CreatePost() {
  const [post, setPost] = useState("");
  const [addingPost, setAddingPost] = useState(false);
  const posts = usePosts();

  const handleAddPostClick = async () => {
    setAddingPost(true);

    const response = await addFriend(post);

    if (response.success) {
      setPost("");
      posts.addPostToState(response.data.post);
      console.log("Successfully added post");
    } else {
      console.error("Couldn't add post");
    }

    setAddingPost(false);
  };

  return (
    <div>
      <textarea
        className={styles.createPost}
        value={post}
        onChange={(e) => setPost(e.target.value)}
      ></textarea>
      <div>
        <button
          className={styles.addPostBtn}
          onClick={handleAddPostClick}
          disabled={addingPost}
        >
          {addingPost ? "Adding Post..." : "Add Post"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
