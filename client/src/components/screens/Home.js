import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
export const Home = () => {
    const [data, setdata] = useState([])
    const [profile, setprofile] = useState([])
    const emptyString = " "
    const [commentValue, setcommentValue] = useState("");

    const { state, dispatch } = useContext(UserContext)
    const gotName = JSON.parse(localStorage.getItem("User"))


    useEffect(() => {
        fetch('/allPost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then((result) => {


                setdata(result)
               
            })
    }, [])
    const likePost = (id) => {
        console.log("Like")
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
                
                const newData = data.filter(item => item._id !== result._id)
                
                setdata(newData)
               
                
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

        <div className="home">
            {data.map(item => {
               

                return (
                    <div className="card home-card" key={item._id}>
                        <div style={{ display: "flex" }}>
                            <div>
                                <img style={{ width: "50px", height: "50px", borderRadius: "80px" }} src={ item.postedby.profilePicture} ></img>
                            </div>
                            <Link to={"/profile/" + item.postedby._id} style={{ color: "black", fontWeight: "500px", fontSize: "25px", marginLeft: "6px" }}>{item.postedby.name}

                            </Link>
                        </div>
                        <i className="material-icons cursor" style={{ float: "right", position: "relative", marginTop: "-50px", visibility: item.postedby._id === gotName._id ? 'visible' : 'hidden' }} onClick={
                            () => {

                                deletePost(item._id)
                            }
                        } >delete</i>
                        <div className="card-image">
                            <img src={item.photo} style={{
                                width: "40%" 
                            }}></img>
                        </div>

                        <div className="card-content">

                            <h6>{item.title}</h6>
                            <p>{item.body} </p>         

                            <div style={{ display: "flex", justifyContent: "space-around", width: "25%" }}>

                                <h6>{item.likes.length}</h6>



                                {item.likes.includes(state._id) ? <i className="material-icons disable cursor" style={{ color: "black",position:"relative",marginTop:"6px" }} >thumb_up</i> : <i className="material-icons cursor" style={{ color: "red" ,position:"relative",marginTop:"6px" }} onClick={
                                    () => {
                                        likePost(item._id)
                                    }
                                } >thumb_up</i>}
                                <h6>{item.unlikes.length}</h6>


                                {item.unlikes.includes(state._id) ? <i className="material-icons disable cursor" style={{ color: "black" ,position:"relative",marginTop:"6px" }}>thumb_down</i>:<i className="material-icons cursor" style={{ color: "red" ,position:"relative",marginTop:"6px" }} onClick={
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
                )
            })}

        </div>
    )
}
