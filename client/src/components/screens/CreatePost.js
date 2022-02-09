import React, { useState,useEffect } from 'react'
import M from 'materialize-css'
import {useNavigate} from "react-router-dom"

export const CreatePost = () => {
    const [Title, setTitle] = useState("")
    const [Body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, seturl] = useState("")
    const navigate = useNavigate()
    
   
    const postDetails =()=>{
        
        if(url){
            
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body: JSON.stringify(
                    {
                       title:Title,
                       body:Body,
                       photo:url
                    }
                )
            }).then(res => res.json()).then(data => {
                console.log("inside post3")
                seturl("")
                if (data.error) {
                   
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    seturl("")
                    console.log("inside post4")
                    M.toast({ html: "created post  successfully", classes: "#ce93d8 purple darken-3" })
                    navigate('/')
                   
                }
            }) 
           } 
    }
    
   useEffect(() => {
    if(image){
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/connectcloud/image/upload';
        const CLOUDINARY_UPLOAD_PRESET = 'MediaUpload'; 
        const formData =new FormData();
        formData.append('file',image)
        formData.append('upload_preset',CLOUDINARY_UPLOAD_PRESET)
        formData.append("cloud_name","connectcloud")
        
        
       
        fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
          
    

        }).then(res=>res.json()).then(
            data=>{
               
                seturl(data.url)
                setImage("")
            }
        ).catch(err=>{
            console.log(err)
        })
    }
       
   }, [image])
      
        
    
    
    
    return (
        <div className="card input-filed" style={{
            margin: "100px",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input
                type="text"
                placeholder="title"
                value={Title}
                onChange={(e)=>{
                    setTitle(e.target.value)

                }}></input>
            <input
                type="text"
                placeholder="Body"
                value={Body}
                onChange={(e)=>{
                    setBody(e.target.value)

                }}
                ></input>
            <div className="file-field input-field">
                <div className="btn signup">
                    <span>upload image</span>
                    <input type="file"  onChange={
                        (e)=>{
                            setImage(e.target.files[0])
                        } }/>
                </div>

                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>

            </div>
            <div>
   
                <button className="btn signup" type="submit" name="action" onClick={()=>{
                    postDetails()
                }}
                        >upload post
                            <i className="material-icons right">send</i>
                        </button>
            </div>
        </div>

    )
}
