import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    })
  }, []);

  function logout(){
    fetch('http://localhost:4000/logout',{
      credentials: 'include',
      method: 'POST',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

    return(
        <header>
        <a href="/" className="logo">Blog</a>
        <nav>
          {username && (
            <>
              <Link to="/create">Create</Link>
              <button type="button" onClick={logout} style={{ color:"inherit", background:"none",fontSize:14 ,fontWeight:"600" }}>Logout</button>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
    );
}