import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Navigate, useParams } from "react-router-dom";


export default function EditPost() {
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
                         
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],       // custom button values
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
          
            ['clean']                                         // remove formatting button
          ]
    }

    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
        .then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            });
        });
    },[]);

    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set(`id`,id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://localhost:4000/post',{
            method:'PUT',
            body:data,
            credentials:'include',
        });
        if(response.ok) {
            setRedirect(true);
        }
        
    }

    if(redirect) {
        return <Navigate to={'/post/'+id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type="title" 
            placeholder={'Title'} 
            value={title} 
            onChange={ev =>setTitle(ev.target.value)}/>
            <input type="summary" 
            placeholder={'Summary'}
            value={summary}
            onChange={ev =>setSummary(ev.target.value)}/>
            <input type="file"
            onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill value={content} 
            onChange={newValue => setContent(newValue)} 
            modules={modules} />
            <button style={{marginTop:'5px'}}>Update Post</button>
        </form>
    );
}