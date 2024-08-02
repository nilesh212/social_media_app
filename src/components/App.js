import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { getPosts } from "../api";
import { Home, Login, Settings, Signup, UserProfile } from "../pages";
import { Loader, Navbar } from "./";
import { useAuth } from "../hooks";

function PrivateRoute({ children, ...rest }) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        if (auth.user) {
          return children;
        } else {
          return <Navigate to="/login"></Navigate>;
        }
      }}
    ></Route>
  );
}

const Page404 = () => {
  return <h1>404</h1>;
};

function App() {
  const auth = useAuth();
  // const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const response = await getPosts();

  //     if (response.success) {
  //       setPosts(response.data.posts);
  //     }

  //     setLoading(false);
  //   };

  //   fetchPosts();
  // }, []);

  if (auth.loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Router basename="/">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home props={posts}></Home>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Signup></Signup>}></Route>
          <PrivateRoute
            path="/settings"
            element={<Settings></Settings>}
          ></PrivateRoute>
          <PrivateRoute
            path="/user/:userId"
            element={<UserProfile></UserProfile>}
          ></PrivateRoute>
          <Route>
            <Page404 />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
