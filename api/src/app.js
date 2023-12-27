const express = require('express');
const app = express ();
const { User } = require('./db/models/user');
const { Task } = require('./db/models/task'); 
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


app.post("/create-task", async (req, res) => {
    const { title, description, status, allocatedToUserId, createdByUserId } = req.body;
    console.log(req.body)
    if (!title || !description || !status || !allocatedToUserId || !createdByUserId) {
        return res.status(400).send("Bad Request");
    }

    try {
        const newTask = await Task.create({
            title: title,
            description: description,
            status: status,
            allocatedToUserId: allocatedToUserId,
            createdByUserId: createdByUserId
        });

        res.status(200).send("Task created successfully!");
    } catch (error) {
        console.log("Error creating task:", error);
        res.status(500).send("Internal Server Error");
    }
}   );
