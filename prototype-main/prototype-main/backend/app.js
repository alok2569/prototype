const express = require("express");
const app = express();
// const dotenv = require("dotenv")
const path = require("path")
const cors = require("cors");
// dotenv.config({ path: "./config.env" })
const router = require("./routes/router")
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
    extended: true, limit: "50mb"
}));

app.use(cors());
const port = 5000

app.use("/users", router);
app.use(express.static(path.join(__dirname, 'public')));



app.route("/*").get((req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})

app.listen(port, () => {
    console.log(`Listening on port ${port} `)
})