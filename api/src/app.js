const express = require('express');
const app = express ();
const cors = require('cors'); // Import the cors middleware
app.use(cors()); // Then use it before your routes are set up:
const { User } = require('./db/models/user');
const { Task } = require('./db/models/task'); 
app.use(express.json());



const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });


app.get("/status", (req, response) => {
    const Status = {
        "Status": "OK"
  }
    response.send(Status);
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        return res.status(400).send("Bad Request");
    }

    try {
        const user = await User.findOne({
            where: {
                username: username,
                password: password
            }
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error logging in:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/register", async (req, res) => {
    const { username, password, confirmPassword, role } = req.body;
    console.log(req.body)
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }
    if (!username || !password || !confirmPassword) {
        return res.status(400).send("Bad Request");
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ where: { username: username } });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        const newUser = await User.create({
            username: username,
            password: password,
            role: role || 1
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


app.put('/update-task/:taskId', async (req, res) => {

    console.log("STATUS", req.body.status)

    const { userid } = req.body;
    console.log("USERID", userid)
    const user = await User.findByPk(userid);

    console.log("USER ROLE", user.role)
    if (user.role !== 2 && req.body.status === 'history') {
        return res.status(401).send('Unauthorized');
    }
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        task.status = req.body.status;
        
        await task.save();

        res.send('Task updated successfully');
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Server error');
    }
});


app.get("/tasks", async (req, res) => {
    const userId = req.query.userId; 
    if (!userId) {
        return res.status(400).send("User ID is required");
    }
    const user = await User.findByPk(userId);
    if (user.role === 2) {
        try {
            const tasks = await Task.findAll();
            res.status(200).json(tasks);
        } catch (error) {
            console.log("Error retrieving tasks:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
    try {
        const tasks = await Task.findAll({ where: { allocatedToUserId: userId } });
        res.status(200).json(tasks);
    } catch (error) {
        console.log("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    }
}
});

app.post("/set-role", async (req, res) => {
    const { userId, role } = req.body;
    if (!userId || !role) {
        return res.status(400).send("Bad Request");
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.role = role;
        await user.save();

        res.status(200).send("Role set successfully!");
    } catch (error) {
        console.log("Error setting role:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.delete("/delete-task/:taskId", async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) {
        return res.status(400).send("Bad Request");
    }

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).send("Task not found");
        }

        await task.destroy();

        res.status(200).send("Task deleted successfully!");
    } catch (error) {
        console.log("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/get-task/:userId/:index", async (req, res) => {
    const { userId, index } = req.params;
    
    if (!userId || isNaN(index)) {
        return res.status(400).send("Bad Request");
    }

    try {
        let task;

        if (index === '0') {
            task = await Task.findOne({ where: { allocatedToUserId: userId } });
        } else {
            task = await Task.findOne({ where: { allocatedToUserId: userId, index: index } });
        }

        if (!task) {
            return res.status(404).send("Task not found");
        }

        res.status(200).json(task);
    } catch (error) {
        console.log("Error retrieving task:", error);
        res.status(500).send("Internal Server Error");
    }
});
