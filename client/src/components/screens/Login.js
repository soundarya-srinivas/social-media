import React,{useState,useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'

export const Login = () => {
    const [email, setemail] = useState()
    const {state,dispatch} = useContext(UserContext)
    const [password, setpasword] = useState()
    const navigate = useNavigate();
    const PostData = () => {
       
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                   
                    password: password,
                    email: email
                }
            )
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" })
            }
            else {
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("User",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({ html: "signed in successfully", classes: "#ce93d8 purple darken-3" })
                navigate('/')
            }
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
                            placeholder="Email"
                            onChange={(e) => {
                                setemail(e.target.value)

                            }}
                            value={email}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                              onChange={(e) => {
                                    setpasword(e.target.value)

                                }}
                                value={password}
                        />
                        <button className="btn signup" type="submit" name="action" onClick={
                            ()=>{
                                PostData()
                            }
                        }>Login
                            <i className="material-icons right">send</i>
                        </button>
                        <h6><Link to="/signup">Dont have an account?create account</Link></h6>
                    </div>
                    
                    </div> 
                </div>
            </div>

        </div>
    )
}
