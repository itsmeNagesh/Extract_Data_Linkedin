const express = require("express");
const axios = require("axios");
const qs = require("querystring"); // Import querystring module
const app = express();
const PORT = 5000;

app.use(express.json());

// Middleware to enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

// Route to initiate the LinkedIn authorization process
app.get("/authcode/linkedin", (req, res) => {
  console.log()
  console.log('now call  for authCode ')
  res.redirect(
    "https://www.linkedin.com/oauth/v2/authorization?" +
      qs.stringify({
        response_type: "code",
        client_id: "866kiduw5chojn",
        redirect_uri: "http://localhost:3000", // Update with your actual domain
        state: "987654321",
        scope: "email profile openid", // Use appropriate LinkedIn scope
      })
  );
});

// Route to handle the callback from LinkedIn and exchange authorization code for access token
app.get("/auth/linkedin/accessToken", async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    console.log('api call for accesstoken')
    const { data } = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=866kiduw5chojn&client_secret=9FumHtZddUI7ky3t&redirect_uri=http://localhost:3000`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("Access token:", data);

    // Send the access token back to the frontend
    res.json({ data });
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    res.status(500).json({ error: "Error exchanging code for access token" });
  }
});


// Route to fetch user info from LinkedIn API
app.get("/userinfo", async (req, res) => {
  console.log('for userinfo')
  const { accessToken } = req.query;

  try {
    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    // Handle errors more gracefully
    console.error("Error fetching user info:", error);
    // res.status(error.response.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
