import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";

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

export default function CreatePost(){
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        ev.preventDefault();
        console.log(files);
        const response = await fetch('http://localhost:4000/post', {
            method:'POST',
            body: data, 
            credentials:'include',
        });
        if (response.ok){
            setRedirect(true);
        }
    }
    
    if(redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <form onSubmit={createNewPost}>
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
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    );
}