import React from 'react';
import ProfilePageForm from '../../components/ProfilePageForm/ProfilePageForm';
import ProfileData from '../../components/ProfileData/ProfileData'
import ImageUploader from 'react-images-upload';

import axios from 'axios'

import 'reactjs-popup/dist/index.css';
import "./ProfilePage.css"

export default class ProfilePage extends React.Component {
    
    state = {
        userData: {},
        profileData: null,
        imageUrl: "",
        photo: true,
        visible: false,

      }
 
      constructor(props) {
        super(props);
        // console.log("constructor props", props)
         this.state = { pictures: []};
         this.onDrop = this.onDrop.bind(this);
         this.uploadImages = this.uploadImages.bind(this)
         
    }
    
    onDrop = (picture) => {
        this.setState({
            pictures: this.state.pictures.concat(picture),
            photo: true,
            visible: true
        });
      }


    uploadImages(){ 
      console.log(this.state.pictures)
      let uploadPromises = this.state.pictures.map(image => {
        let data = new FormData();
        data.append('image', image, image.name)
        return axios.post(`/api/users/profile/${this.state.profileData._id}/uploadImage`, data)
      })
      axios.all(uploadPromises)
      .then(images => {
        console.log('server response: ')
        
        this.setState({
          photo: false,
          tab: false,
          visible: false
      });
      this.getProfile()
    console.log(images)
      })
    }

      getProfile = async () => {
        let jwt = localStorage.getItem('token')
          let fetchProfileDataResponse = await fetch('/api/users/profile', {headers: {'Authorization': 'Bearer ' + jwt}})
          if (!fetchProfileDataResponse.ok) throw new Error("Couldn't fetch orders")
          let profile = await fetchProfileDataResponse.json() // <------- convert fetch response into a js object
          this.setState({ profileData: profile})
          
      }

      

      async componentDidMount() {
      try {
            let jwt = localStorage.getItem('token')
            let fetchUserDataResponse = await fetch('/api/users/userdata', {headers: {'Authorization': 'Bearer ' + jwt}})
            if (!fetchUserDataResponse.ok) throw new Error("Couldn't fetch orders")
          let userD = await fetchUserDataResponse.json() // <------- convert fetch response into a js object
            this.setState({ userData: userD})
            this.getProfile();        
            } catch (err) {
                  console.error('ERROR:', err) // <-- log if error
            }
      }

  render() {
        return (
            <div className="profileIndex">
                <h1 className="profileTitle">User Profile</h1>
                <h2 className="profileName"> Name: {this.state.userData?.name}</h2>
                <h2 className="profileEmail"> Email: {this.state.userData?.email}</h2>


                <button onClick = {() => {this.props.toggle(1)} }>Show</button>
                {this.state.userData?.friends.map(f =>
                <div className={this.props.tab === 0 ? 'hidden' : undefined }>
      
               <img className="profileImage" src={f.imageUrl}/>
               <p>{f.name}<button className="xDelete" onClick={() => {this.props.handleDelete(this.state.userData._id, f.user)}}>X</button></p></div>)} 
               <button onClick = {() => {this.props.toggle(0)} }>Hide</button>
               

                {this.state.profileData ? 
               
                <div className="photoUpload">
                  
                  <img className="profileImg" src={`${this.state.profileData.imageUrl}?${new Date()}`} key={new Date().getTime()} />

                  
                  <ProfileData getProfile={this.getProfile} profileData={this.state.profileData} friends={this.state.userData?.friends} handleEdit={this.props.handleEdit} clickedEdit={this.props.clickedEdit}/>

                  <ImageUploader
                        key="image-uploader"
                        withIcon={false}
                        singleImage={true}
                        withPreview={this.state.photo}
                        label=""
                        buttonText="Change Profile Picture"
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.png', '.jpeg']}
                        maxFileSize={5242880}
                        />

                  <button  className={this.state.visible ? undefined : 'hidden'} onClick={() => {this.uploadImages()}}>Looks Good</button>
                  </div>
                  
                  :
                  <ProfilePageForm getProfile={this.getProfile}/>
                  }
            </div>
            )
      }
}
    