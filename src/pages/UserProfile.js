import { useAuth } from "../hooks";
import { useLocation, useParams, useHistory } from "react-router-dom";
import styles from "../styles/settings.module.css";
import { useEffect, useState } from "react";
import { addFriend, deleteFriend, fetchUserProfile } from "../api";
import { Loader } from "../components";

function UserProfile() {
  // const location = useLocation(); // Gets the url path with passed props
  // const { user = {} } = location.state;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);

  const history = useHistory(); //useNavigate

  const { userId } = useParams();
  const auth = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchUserProfile(userId);

      if (response.success) {
        setUser(response.data.user);
      } else {
        return history.push("/");
      }

      setLoading(false);
    };
    getUser();
  }, [userId, history]);

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);
    const response = await addFriend(userId);
    if (response.success) {
      const { friendship } = response.data;
      auth.updateUserFriends(true, friendship);
      console.log("Successfully added friend");
    } else {
      console.error("Couldn't add a friend");
    }
    setRequestInProgress(false);
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);
    const response = await deleteFriend(userId);
    if (response.success) {
      const friendship = auth.user.friends.filter((f) => {
        return f.to_user._id === userId;
      });
      auth.updateUserFriends(false, friendship[0]);
      console.log("Successfully removed friend");
    } else {
      console.error("Couldn't remove a friend");
    }
    setRequestInProgress(false);
  };

  const checkIfUserIsAFriend = () => {
    const friends = auth.user.friends;

    const friendsId = friends.map((friend) => friend.to_user._id);

    const index = friendsId.indexOf(userId);

    if (index != -1) {
      return true;
    }
    return false;
  };

  if (loading) {
    return <Loader></Loader>;
  }

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
          alt=""
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user.email}</div>
        {/* {auth.user?.email} equivalent to {auth && auth.user?auth.user.email:undefined*/}
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>

        <div className={styles.fieldValue}>{user.name}</div>
      </div>

      <div className={styles.btnGrp}>
        {checkIfUserIsAFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriendClick}
          >
            {requestInProgress ? "Removing friend..." : "Remove Friend"}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriendClick}
          >
            {requestInProgress ? "Adding friend...." : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
