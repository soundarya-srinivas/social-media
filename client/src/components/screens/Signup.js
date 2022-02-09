import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from 'materialize-css'

export const Signup = () => {
    const [email, setemail] = useState()
    const [name, setname] = useState()
    const [password, setpasword] = useState()
    const navigate = useNavigate();
    const [image, setimage] = useState()
    const [url, seturl] = useState(undefined)
    useEffect(() => {
        if (url) {
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                return M.toast({ html: "Invalid ..email ID", classes: "#c62828 red darken-3" })

            }
            fetch("/signup", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        name: name,
                        password: password,
                        email: email,
                        pic: url
                    }
                )
            }).then(res => res.json()).then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#ce93d8 purple darken-3" })
                    navigate('/Signin')
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }, [url])
    const PostDetails = () => {
        if (image) {
            uploadProfilePic()
        }
        else {
            uploadfields()
        }
    }
    const uploadfields = () => {
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    name: name,
                    password: password,
                    email: email,
                    pic:undefined

                }
            )
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" })
            }
            else {
                M.toast({ html: data.message, classes: "#ce93d8 purple darken-3" })
                navigate('/Signin')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    const uploadProfilePic = () => {
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/connectcloud/image/upload';
        const CLOUDINARY_UPLOAD_PRESET = 'MediaUpload';
        const formData = new FormData();
        formData.append('file', image)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        formData.append("cloud_name", "connectcloud")



        fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,



        }).then(res => res.json()).then(
            data => {
                seturl(data.url)
            }
        ).catch(err => {
            console.log(err)
        })
    }


    return (
        <div>
            <div className="row">

                <div className="col s12 m6">
                    <div className=" auth-card">
                        <div className="card landing">
                            <h4 className="landingName">Connect</h4>

                            <input
                                type="text"
                                placeholder="Enter your Name"
                                onChange={(e) => {
                                    setname(e.target.value)

                                }}
                                value={name}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                onChange={(e) => {
                                    setemail(e.target.value)

                                }}
                                value={email}
                            />

                            <input
                                type="text"
                                placeholder="Password"
                                onChange={(e) => {
                                    setpasword(e.target.value)

                                }}
                                value={password}
                            />
                            <div className="file-field input-field">
                                <div className="btn signup">
                                    <span>upload image</span>
                                    <input type="file" onChange={
                                        (e) => {
                                            setimage(e.target.files[0])
                                        }} />
                                </div>

                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>

                            </div>
                            <button className="btn  signup" type="submit" onClick={() => {
                                PostDetails()
                            }} name="action">Sign Up
                                <i className="material-icons right">send</i>
                            </button>
                            <h6 ><Link to="/Signin">Already have an account?</Link></h6>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
