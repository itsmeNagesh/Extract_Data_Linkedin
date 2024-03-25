import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (code) {
          const response = await axios.get(`http://localhost:5000/auth/linkedin/accessToken?code=${code}`);
          const accessToken = response.data.data.access_token;
          setAccessToken(accessToken);

          const userInfoResponse = await axios.get(`http://localhost:5000/userinfo?accessToken=${accessToken}`);
          setUserData(userInfoResponse.data);
        } else {
          console.log("Authorization code not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };

    if (code) {
      fetchUserData();
    }
  }, [code]); // Depend on 'code' to trigger useEffect when it changes

  const authorizeLinkedIn = () => {
    window.location.href = "http://localhost:5000/authcode/linkedin";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    setCode(authorizationCode);
  }, []); // This effect runs only once after the initial render to set the authorization code

  return (
  <>
  <div>
       <div className="container text-center">
       <div className="row "><h2 className="d-inline-block bg-danger">Find Your Data From</h2>
       <h1 style={{color:"blue"}}>LinkedIn</h1> </div>
 
       </div>
 
      {userData ? 
      <div className="container text-center">
       
          
          <div className="row d-flex justify-content-center aligment-item-center">
         {userData &&  <img src={userData.picture}   className="pic text-center"  style={{borderRadius:"50%"}} /> }

          </div>
          <div className="row">
          {isLoading ? (
        <p>Loading...</p>
      ) : (
        userData && (
          <div>
            <h2>User Details:</h2>
            <ul>
              {Object.entries(userData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </li>
              ))}
            </ul>
          </div>

        )

      )}
       <button  style={{backgroundColor:"#DC3545" ,border:"0" ,height:"40px"}} className="fw-bold" onClick={()=>{
        setUserData('')
       }}>Cancel</button>
      </div>

      </div>: <div className="d-flex justify-content-center alignment-item-center mt-5"><button onClick={authorizeLinkedIn} className="btn btn-primary ">Authorize with LinkedIn</button></div>   }

     
      
    </div>
  </>
    
  );
};

export default UserData;
