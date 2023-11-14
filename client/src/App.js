import './App.css';
import Layout from './Layout.js';
import { UserContextProvider } from './UserContext.js';
import CreatePost from './pages/CreatePost.js';
import EditPost from './pages/EditPost.js';
import IndexPage from './pages/IndexPage.js';
import LoginPage from './pages/LoginPage.js';
import PostPage from './pages/PostPage.js';
import RegisterPage from './pages/RegisterPage.js';
import Post from "./post.js";
import {Route,Routes} from "react-router-dom";
function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage /> } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/edit/:id" element={<EditPost />} />
      </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
