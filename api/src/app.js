const express = require('express');
const app = express ();
const { User } = require('./db/models/user'); // Adjust the relative path accordingly

app.use(express.json());



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });


app.get("/status", (req, response) => {
    const Status = {
        "Status": "OK"
  }
    response.send(Status);
});


app.post("/register", async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body)
    if (!username || !password || !role) {
        return res.status(400).send("Bad Request");
    }

    try {
        const newUser = await User.create({
            username: username,
            password: password,
            role: role
        });

        res.status(200).send("User created successfully!");
    } catch (error) {
        console.log("Error creating user:", error);
        res.status(500).send("Internal Server Error");
    }
});
