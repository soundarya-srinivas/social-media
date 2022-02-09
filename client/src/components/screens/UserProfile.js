import React, { createRef, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import ScrollIntoView from 'react-scroll-into-view'



export const UserProfile = () => {
    const [userProfile, setuserProfile] = useState([]);
    const [Prof, setProf] = useState([])
   
    const [userProfilePosts, setuserProfilePosts] = useState([]);
    const { state, dispatch } = useContext(UserContext)
    const [data, setdata] = useState([])
    const emptyString = " "
    const [followersid, setfollowersid] = useState([]);
    const [followingid, setfollowingid] = useState([]);
    const [commentValue, setcommentValue] = useState("");

    const gotName = JSON.parse(localStorage.getItem("User"));
    const Userid = gotName._id
    const { userid } = useParams()
    const [id, setid] = useState([])
    useEffect(() => {
       
       
       
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res =>
                res.json()

            )
            .then(result => {

                setProf(result)
                setuserProfile(result.userdata)
                setuserProfilePosts(result.posts)






            })

        fetch(`/followers/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        }).then(res => res.json())
            .then(result => {


                setfollowersid(result)
               console.log("ids",result)
               console.log("id",followersid.some(e=>e._id === Userid))
            })


        fetch(`/following/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        }).then(res => res.json())
            .then(result => {

                setfollowingid(result)
            })
    }, [])



    const followUser = () => {
       
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("User", JSON.stringify(data))

                setfollowersid(prevArray => [...prevArray, data])
               
                console.log("followers",followersid)
             

            })

    }
    const unfollowUser = () => {
        console.log("unfollow")
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followid: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("User", JSON.stringify(data))



                const newFollower = followersid.filter(item => item._id !== data._id)
                
                setfollowersid(newFollower)
           

               



            })

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
                const newData = userProfilePosts.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setuserProfilePosts(newData)
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
                const newData = userProfilePosts.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setuserProfilePosts(newData)
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


                const newData = userProfilePosts.map(item => {
                    if (item._id == result._id) {
                        return result
                    }
                    else {
                        return item
                    }

                })
                setuserProfilePosts(newData)
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

                setuserProfilePosts(result)
            }).catch(err => {
                console.log(err)
            })

    }
    return (

        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            {
                userProfilePosts ? <div> <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "18px 0px"
                }}>
                    <div>
                        <div>
                            <img style={{ width: "160px", maxHeight: "160px", borderRadius: "80px" }} src={userProfile.profilePicture} ></img>
                        </div>
                        <div>
                            <h4>{userProfile.name}</h4>
                            <h6>{userProfile.email}</h6>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-around",
                                width: "104%",

                            }}>
                                <h6>{userProfilePosts.length} </h6>
                                <h6>{followersid.length} </h6>
                                <h6> {followingid.length} </h6>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-around",
                                width: "108%",
                                borderBottom: "1px solid grey",

                            }} >
                                <ScrollIntoView selector="#posts">

                                    <button className="btn signup"> Posts</button>
                                </ScrollIntoView>

                                <Popup trigger={<button className="btn signup" > followers</button>} position="right center" >

                                    {close => (
                                        followersid.length != 0 ?
                                            followersid.map(item => {
                                                return (

                                                    <div key={item._id} style={{ display: "flex", justifyContent: "space-between" }}>

                                                        <img style={{ width: "80px", height: "80px", borderRadius: "80px" }} src={item.profilePicture} ></img>
                                                        <Link to={"/profile/" + item._id} style={{ float: 'right', fontSize: "20px", marginTop: "10px", color: "black" }} onClick={close} className="profileName">{item.name}</Link>
                                                        <a className="close " style={{ float: "left", fontSize: "30px", color: "black" }} onClick={close}>&times;</a>


                                                    </div>
                                                )
                                            }) : <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <h6>{userProfile.name} has no followers</h6>
                                                <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a></div>
                                    )}

                                </Popup>



                                <Popup trigger={<button className="btn signup" > following</button>} position="right center" >

                                    {close => (
                                        followingid.length != 0 ?
                                            followingid.map(item => {
                                                return (
                                                    <div key={item._id} style={{ display: "flex", justifyContent: "space-between" }}>

                                                        <img style={{ width: "80px", height: "80px", borderRadius: "80px" }} src={item.profilePicture}></img>

                                                        <Link to={"/profile/" + item._id} style={{ float: 'right', fontSize: "20px", marginTop: "10px", color: "black" }} className="profileName" onClick={close}>{item.name}</Link>
                                                        <a className="close " style={{ float: "left", fontSize: "30px", color: "black" }} onClick={close}>&times;</a>

                                                    </div>
                                                )
                                            }) : <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <h6>{userProfile.name} is not following any one</h6>
                                                <a className="close " style={{ float: "left", fontSize: "30px" }} onClick={close}>&times;</a></div>

                                    )}

                                </Popup>
                            </div>
                            {
                               
                                userid === Userid ? " " : ((followersid.some(e=>e._id === Userid)) ? <button style={{ marginTop: "10px" }} className=" btn signup" onClick={() => {
                                    unfollowUser()
                                }}>
                                    unfollow
                                </button> : <button className=" btn signup" style={{ marginTop: "10px" }} onClick={() => {
                                    followUser()
                                }}>
                                    follow
                                </button>
                                )}

                            <br />
                        </div>
                    </div>


                </div>
                    <div className="gallery" id='posts'>
                        {
                            userProfilePosts.map(item => {
                                return (
                                    <div key={item._id}>
                                        <div style={{ width: "300px" }} className="card home-card"   >
                                            <div className="card-image" >
                                                <img className="item" src={item.photo}></img>
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
                                                                    <div style={{ border: "none", borderRadius: "10px", backgroundColor: "#F2F3F5" }} key={record._id}>
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
                                        </div>
                                    </div>

                                )
                            })
                        }


                    </div></div> : "No posts have been posted"
            }

        </div>
    )
}
