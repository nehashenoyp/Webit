import { useContext, useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import {format} from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
    const{userInfo} = useContext(UserContext);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo);
            });
        });
    }, []); 

    if (!postInfo) return '';

    return(
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <div className="author">by @{postInfo.author.username}</div>
            <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row"> 
                    <Link className="edit-button" to={`/edit/${postInfo._id}`}>Edit this post</Link>
                </div>
            )}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt = "" />
            </div>
            
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
}