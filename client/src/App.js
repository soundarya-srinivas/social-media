
import './App.css';
import { Navbar } from './components/Navbar';
import { BrowserRouter, Routes, Route,useNavigate } from 'react-router-dom'
import { Home } from './components/screens/Home';
import { Login } from './components/screens/Login';
import { Signup } from './components/screens/Signup';
import { Profile } from './components/screens/Profile';
import { Footer } from './components/Footer';
import { CreatePost } from './components/screens/CreatePost';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/userReducer';
import { UserProfile } from './components/screens/UserProfile';



export const UserContext = createContext()


const Routing = () => {
  const navigate=useNavigate()
  const {state,dispatch}=useContext(UserContext)
  useEffect(() => {
   const user =JSON.parse( localStorage.getItem("User"))
   
   
   
   if(user){
     dispatch({type:"USER",payload:user})
     
   }
   else{
     navigate("/Signin")
   }
    
  }, [])
  return (
    <Routes>


      <Route path="/" element={<Home />} />
      <Route path="/Signin" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route exact path="/Profile" element={<Profile />} />
      <Route path="/CreatePost" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />


    </Routes>
  )
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      

      <Routing />
      <Footer />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
