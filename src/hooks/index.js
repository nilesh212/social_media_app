import { useContext, useEffect, useState } from "react";
import { AuthContext, PostsContext } from "../providers";
import jwt from "jwt-decode";

import {
  login as userLogin,
  editProfile,
  register,
  fetchUserFriends,
  getPosts,
} from "../api";
import {
  getItemFromLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  setItemInLocalStorage,
} from "../utils";

export const useAuth = () => {
  //We are using this so that we don't have to call AuthContext again and again.
  //That means we don't have to import AuthContext in every file.
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /// This for when user refreshes the page then he should be logged in.
  /// So we get jwt token from Local Storage
  useEffect(() => {
    const getUser = async () => {
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

      if (userToken) {
        const user = jwt(userToken);

        const response = await fetchUserFriends(); //To make sure friends are there when we refresh the page

        let friends = [];
        if (response.success) {
          friends = response.data.friends;
        } else {
          friends = [];
        }

        setUser({ ...user, friends });
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const updateProfile = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.toke ? response.data.token : null
      );
      return { success: true };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const updateUserFriends = async (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        friends: [...user.friends, friend],
      });
      return;
    }
    const newFriends = user.friends.filter(
      (f) => f.to_user._id !== friend.to_user._id
    );

    setUser({
      ...user,
      friends: newFriends,
    });
  };

  const login = async (email, password) => {
    const response = await userLogin(email, password);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.toke ? response.data.token : null
      );
      return { success: true };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const signup = async (name, email, password, confirmPassword) => {
    const response = await register(name, email, password, confirmPassword);

    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };

  return {
    user,
    login,
    logout,
    loading,
    signup,
    updateProfile,
    updateUserFriends,
  };
};

export const usePosts = () => {
  //We are using this so that we don't have to call AuthContext again and again.
  //That means we don't have to import AuthContext in every file.
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  /// This for when user refreshes the page then he should be logged in.
  /// So we get jwt token from Local Storage
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const addPostToState = (post) => {
    const newPosts = [post, ...posts];
    setPosts(newPosts);
  };

  const addComment = (comment, postId) => {
    const newPosts = posts.map((post) => {
      if (post._id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });

    setPosts(newPosts);
  };

  return {
    data: posts,
    loading,
    addPostToState,
    addComment,
  };
};
