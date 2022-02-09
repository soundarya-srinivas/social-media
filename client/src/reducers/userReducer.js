

export const initialState= null;
export const reducer =(state,action)=>{
    if(action.type==="USER"){
      
        return action.payload
    }
    if(action.type==="UPDATE"){
      
     
        return {
            ...state,
           
        followers:action.payload.followers,
        following:action.payload.following
        }
    }
    if(action.type==="UPDATEPICTURE"){
      
        console.log("profile",action.payload.profilePicture)
          return {
              ...state,
              profilePicture:action.payload.profilePicture
          
          }
      }
    return state
}

