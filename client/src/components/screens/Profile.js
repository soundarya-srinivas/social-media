import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import Popup from 'reactjs-popup';
import Webcam from "react-webcam"
import 'reactjs-popup/dist/index.css';
import ScrollIntoView from 'react-scroll-into-view'



export const Profile = () => {
    const [mypics, setPics] = useState([]);
    const [postLen, setpostLen] = useState();
    const [data, setdata] = useState([])
    const [image, setimage] = useState("")
    const [url, seturl] = useState(undefined)
    const [newURL, setnewURL] = useState(undefined)
    const [imageFile, setimageFile] = useState("")
    const [isCameraPopupOpen, setisCameraPopupOpen] = useState(false)

    const emptyString = " "
    const [commentValue, setcommentValue] = useState("");
    const [showLoading, setshowLoading] = useState(false)



    const gotName = JSON.parse(localStorage.getItem("User"));


    const { state, dispatch } = useContext(UserContext)
    const [followersid, setfollowersid] = useState([]);
    const [followingid, setfollowingid] = useState([]);
    const webcamRef = React.useRef(null);



    useEffect(() => {
        setnewURL(undefined)
        console.log("newurl",newURL)
        console.log("state",state?state:"no state")

        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res =>
                res.json()

            )
            .then(result => {

                setPics(result.posts)
                setpostLen(result.posts.length)



            })
        fetch('/followers', {
            headers: {

                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        }).then(res => res.json())
            .then(result => {

                setfollowersid(result)
            })
        fetch('/following', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        }).then(res => res.json())
            .then(result => {


                setfollowingid(result)
            })
            if (imageFile) {
                console.log("logginf", imageFile)
                setshowLoading(true)
    
                const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/connectcloud/image/upload';
                const CLOUDINARY_UPLOAD_PRESET = 'MediaUpload';
                const formData = new FormData();
                formData.append('file', imageFile)
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                formData.append("cloud_name", "connectcloud")
    
    
    
                fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
    
    
    
                }).then(res => res.json()).then(
                    (data) => {
    
                        seturl(data.url)
    
                        setimageFile("")
    
                    }
                ).catch(err => {
                    console.log(err)
                })
            }


    }, [imageFile])


    const videoConstraints = {
        width: { min: 480 },
        height: { min: 720 },
        aspectRatio: 0.6666666667,
        facingMode: "user"
    }




    const capture = React.useCallback(
        (data) => {


            const imageSrc = webcamRef.current.getScreenshot();
            setimage(imageSrc)

            setshowLoading(true)

            const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/connectcloud/image/upload';
            const CLOUDINARY_UPLOAD_PRESET = 'MediaUpload';
            const formData = new FormData();
            formData.append('file', imageSrc)
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            formData.append("cloud_name", "connectcloud")



            fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,



            }).then(res => res.json()).then(
                (data) => {

                    seturl(data.url)
                  
                }
            ).catch(err => {
                console.log(err)
            })




        },
        []
    )
  
    const uploadPhoto = () => {
        

        if (url) {

         


            fetch("/profilePicUpdate", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify(
                    {
                        pic: url
                    }
                )
            }).then(res => res.json())
                .then(data => {
                    localStorage.setItem("User", JSON.stringify(data))
                    dispatch({ type: "UPDATEPICTURE", payload: { profilePicture: data.profilePicture } })
                    setnewURL(data.profilePicture)
                    setshowLoading(false)
                    setimageFile("")
                    setimage("")
                    seturl(undefined)
                    console.log("compltd")

                })
        }
        else {

            setshowLoading(false)
        }


    }


    const likePost = (id) => {

        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify(
                {
                    postId: id
                }
            )
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setdata(newData)
                console.log("new dats", newData)
            }).catch(err => {
                console.log(err)
            })


    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify(
                {
                    postId: id
                }
            )
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setdata(newData)
                console.log("new dats", newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {


        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify(
                {
                    postId: postId,
                    text: text,
                    name: gotName.name
                }
            )
        }).then(res => res.json())
            .then(result => {
                console.log("user", result)

                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setdata(newData)
            }).catch(err => {
                console.log(err)
            })

    }
    const deletePost = (postId) => {

        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {


                const newData = mypics.filter(item =>
                    item._id !== result._id
                )

                setPics(newData)
            }).catch(err => {
                console.log(err)
            })

    }
    const deleteComment = (commentId, postid) => {
        console.log(commentId)
        fetch(`/deleteComment/${commentId}/${postid}`, {
            method: "delete",
            headers:
            {

                "Authorization": "Bearer " + localStorage.getItem("jwt")

            }

        }).then(res => res.json())
            .then((result) => {

                setdata(result)
            }).catch(err => {
                console.log(err)
            })

    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px"
            }}>
                <div>
                    <div className="container">
                        <img className="image" style={{ width: "150px", height: "160px", borderRadius: "80px" }} src={typeof newURL !== "undefined" ? newURL : state ? state.profilePicture : ""} ></img>

                        {
                            showLoading ? <h6 style={{ color: "blue" }}>Loading.....</h6> : ""
                        }
                        {/* {
                            ErrorMessage ? <h6 style={{ color: "blue" }}>couldnt upload pic</h6> : ""
                        } */}
                        <div className="middle">


                            <Popup contentStyle={{ width: "600px", height: "400px", marginTop: "9%" }} trigger={<i style={{ fontSize: "40px", cursor: "pointer" }} onClick={(() => { setisCameraPopupOpen(true) })} className=" large material-icons text">add_a_photo</i>} position=" center" >

                                {close => (

                                    <div style={{ borderBottom: "1px solid white", backgroundColor: "white" }}>
                                        <div style={{ minWidth: "600px", display: "flex" }}>
                                            <i onClick={
                                                close} className="material-icons">close</i>
                                            <Webcam
                                                audio={false}
                                                width={480}
                                                height={380}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"

                                                videoConstraints={videoConstraints}
                                            />


                                            {image ? <img style={{ height: "380px", width: "400px" }} src={image}></img> : ""}
                                        </div>
                                        <button className="btn signup" style={{ marginLeft: "40%", marginTop: "5px" }} onClick={() => {
                                            capture();
                                        }}>Capture photo</button>
                                        <button className="btn signup" style={{ marginLeft: "40%", marginTop: "5px" }} onClick={() => {
                                            uploadPhoto()

                                        }}><span onClick={close} style={{ fontSize: "15px" }}>upload photo</span></button>
                                    </div>


                                )}
                            </Popup>
                            <Popup contentStyle={{ width: "400px", height: "250px", marginTop: "4%" }} trigger={<i style={{ fontSize: "42px", position: "relative", top: "3px" }} className=" large material-icons text">folder</i>} position=" center" >

                                {close => (
                                    <div>
                                        <div className="file-field input-field">
                                            <div className="btn signup">
                                                <span>upload image</span>
                                                <input type="file" onChange={
                                                    (e) => {
                                                        setimageFile(e.target.files[0])
                                                    }



                                                }
                                                 />
                                            </div>

                                            <div  className="file-path-wrapper">
                                                <input 
                                                    className="file-path validate" type="text" />
                                            </div>

                                        </div>
                                        <button onClick={() => {
                                            uploadPhoto()
                                        }} className="btn  signup" type="submit" name="action"> <span style={{ fontSize: "15px" }} onClick={close} >Upload</span>

                                        </button>
                                    </div>
                                )}
                            </Popup>



                        </div>
                    </div>

                    <div>
                        <h4>{state ? state.name : ""}</h4>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            width: "104%"

                        }}>
                            <h6>{postLen}</h6>
                            <h6>{followersid.length}</h6>
                            <h6>{followingid.length}</h6>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            width: "108%",
                            borderBottom: "1px solid grey"
                        }} >
                            <ScrollIntoView selector="#posts" smooth="true">

                                <button className="btn signup"> Posts</button>
                            </ScrollIntoView>

                            <Popup trigger={<button className="btn signup" > followers</button>} position="right center" >

                                {close => (
                                    followersid.length != 0 ?
                                        followersid.map(item => {
                                            return (


                                                <div key={item._id} style={{ display: "flex", justifyContent: "space-between" }}>

                                                    <Link to={"/profile/" + item._id} style={{ float: 'right' }}>{item.name}</Link>
                                                    <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a>

                                                </div >
                                            )
                                        }) : <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <h6>No followers</h6>
                                            <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a></div>
                                )}

                            </Popup>




                            <Popup trigger={<button className="btn signup"> following</button>} position="right center" >

                                {close => (
                                    followingid.length != 0 ?
                                        followingid.map(item => {
                                            return (
                                                <div key={item._id} style={{ display: "flex", justifyContent: "space-between" }}>

                                                    <Link to={"/profile/" + item._id} style={{ float: 'right' }}>{item.name}</Link>
                                                    <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a>

                                                </div>
                                            )
                                        }) : <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <h6>Your not following anyone ! </h6>
                                            <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a></div>

                                )}

                            </Popup>




                        </div>
                    </div>
                </div>


            </div>
            <div className="gallery" id='posts'>
                {
                    mypics.map(item => {
                        return (

                            <div style={{ width: "300px" }} className="card home-card" key={item._id}  >
                                <div className="card-image" style={{ display: "flex", justifyContent: "space-around", width: "95%" }}>

                                    <img className="item" src={item.photo}></img>
                                    <i className="material-icons cursor" style={{ float: "right", position: "relative" }} onClick={
                                        () => {

                                            deletePost(item._id)
                                        }
                                    } >delete</i>
                                </div>

                                <div className="card-content">

                                    <h6>{item.title}</h6>
                                    <h6>{item.body}</h6>

                                    <div style={{ display: "flex", justifyContent: "space-around", width: "25%" }}>

                                        <h6>{item.likes.length}</h6>



                                        {item.likes.includes(state._id) ? <i className="material-icons disable cursor" style={{ color: "black", position: "relative", marginTop: "6px" }} >thumb_up</i> : <i className="material-icons cursor" style={{ color: "red", position: "relative", marginTop: "6px" }} onClick={
                                            () => {
                                                likePost(item._id)
                                            }
                                        } >thumb_up</i>}
                                        <h6>{item.unlikes.length}</h6>


                                        {item.unlikes.includes(state._id) ? <i className="material-icons disable cursor" style={{ color: "black", position: "relative", marginTop: "6px" }}>thumb_down</i> : <i className="material-icons cursor" style={{ color: "red", position: "relative", marginTop: "6px" }} onClick={
                                            () => {
                                                unlikePost(item._id)
                                            }
                                        } >thumb_down</i>}
                                    </div>
                                    <h6 style={{ color: "grey", borderTop: "1px solid grey ", borderTopWidth: "1px", borderBottom: "1px solid grey" }}>Comments</h6>


                                    {
                                        item.comments.map(record => {
                                            return (
                                                <>
                                                    <div style={{ border: "none", borderRadius: "10px", backgroundColor: "#F2F3F5" }}>
                                                        <h6 style={{ marginLeft: "5px" }}><span style={{ fontWeight: "500" }} key={record._id}>{record.name}</span></h6>
                                                        <h6 style={{ marginLeft: "5px" }}> {record.text} <i style={{ marginTop: "-8px", fontSize: "22px", color: "black", float: "right", visibility: record.postedby === gotName._id ? 'visible' : 'hidden' }} className="material-icons  cursor " onClick={
                                                            () => {

                                                                deleteComment(record._id, item._id)
                                                            }
                                                        } >delete</i>

                                                        </h6>
                                                    </div>


                                                </>
                                            )
                                        })
                                    }
                                    <form onSubmit={(e) => {
                                        e.preventDefault();

                                        makeComment(commentValue, item._id)

                                        setcommentValue(emptyString)


                                    }}>
                                        <input
                                            style={{ border: "1px solid grey", borderRadius: "12px" }}
                                            placeholder="write comment"
                                            type="text"
                                            onChange={(e) => {
                                                setcommentValue(e.target.value)
                                            }}
                                            value={commentValue}
                                        ></input>
                                    </form>
                                </div>

                            </div>


                        )
                    })
                }


            </div>
        </div >
    )
}
