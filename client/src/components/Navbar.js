import React, { useContext } from 'react'

import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import M from "materialize-css"

export const Navbar = () => {
    const { state, dispatch } = useContext(UserContext)
    M.AutoInit();

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, { inDuration: 350,
            outDuration: 350,
            edge: 'left' });
    });
    const render = () => {
        if (state) {
            return (
                <>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/CreatePost">create post</Link></li>
                    <li><Link to="/Signin" onClick={
                        () => {
                            JSON.parse(localStorage.removeItem("User"))
                            JSON.parse(localStorage.removeItem("jwt"))
                        }
                    }>Logout</Link></li>

                </>)
        } else {
            return (
                <>
                    <li><Link to="/Signin">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>


                </>
            )

        }
    }
    return (
        <>
            <nav>
                <div className="nav-wrapper ">

                    <Link to={state ? "/" : "/Signin"} className="brand-logo left navbar"

                    >Connect </Link>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>

                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {render()}

                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                {render()}
            </ul>
        </>
    )
}
