const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sashankgopalam:n9Pv91YNnFdqThuq@todolistsample.eg5h3tx.mongodb.net/?retryWrites=true&w=majority&appName=todolistsample", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: { type: String, enum: ["urgent", "high", "low"], default: "low" }
});

const Task = mongoose.model("Task", taskSchema);

// GET Home Page
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.render("list", { tasks });
    } catch (err) {
        console.error(err);
        res.send("Error loading tasks.");
    }
});

// POST Create Task
app.post("/", async (req, res) => {
    const { title, priority } = req.body;
    if (!title.trim()) return res.redirect("/");
    await Task.create({ title, priority });
    res.redirect("/");
});

// POST Delete Task
app.post("/delete", async (req, res) => {
    const { taskId } = req.body;
    try {
        await Task.findByIdAndDelete(taskId);
        res.redirect("/");
    } catch (err) {
        console.log("Delete error:", err);
        res.redirect("/");
    }
});

// POST Edit Task
app.post("/edit", async (req, res) => {
    const { taskId, newTitle, newPriority } = req.body;
    if (!newTitle.trim()) return res.redirect("/");
    try {
        await Task.findByIdAndUpdate(taskId, {
            title: newTitle,
            priority: newPriority
        });
        res.redirect("/");
    } catch (err) {
        console.log("Edit error:", err);
        res.redirect("/");
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
