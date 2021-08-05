import React from "react"
import "./ProfileData.css"
import EditProfileForm from "../EditProfileForm/EditProfileForm.jsx"

export default function ProfileData (props) {
      
      
     
      return(
            <> 
                  {props.clickedEdit ? 
                              <EditProfileForm getProfile={props.getProfile} profileData={props.profileData}/>
                              :
                              <>
                                    <h2>Bio: </h2>
                                    <p>{props.profileData.bio}</p>
                                    <h2>Interests: </h2>
                                    {props.profileData.interests.map(i => <p>{i.label}</p>)}
                                    <p>{props.profileData.friends}</p> 
                                    <button className="editBtn" onClick={ () => props.handleEdit() }>Edit Profile</button>
                              </>
                        }
            </>
            )     
      
}