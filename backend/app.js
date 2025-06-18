const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const util = require("util");
const multer = require("multer");
const app = express();
const port = 3100;
const connection = require("d:\\WEBWIZARD\\webwizard\\backend\\SQLdb.js");
const awaitquery = util.promisify(connection.query).bind(connection);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cors());

const storage = multer.diskStorage({
    destination:"c:\\webwizard\\files",
    filename:async function(req,file,callback){
        let temp = await find_in_blog();
        num = temp.length + 1;
        const filename = `file_${num}.jpg`;
        callback(null,filename)
    }
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1048576
    }
})

const find_in_user = async()=>{
    let rows = [];
    rows = await awaitquery("SELECT * FROM project.user;");
    if (rows.length == 0) {
        return "Data not found";
    } else {
        return rows;
    }
}

const find_in_product = async () => {
    rows = []
    rows = await awaitquery("SELECT * FROM project.product;");
    if (rows.length > 0) {
        return rows
    }
    else {
        return "Data not found"
    }
}

const find_in_product_id = async (id) => {
    rows = []
    rows = await awaitquery(`SELECT * FROM project.product where product_id = '${id}';`);
    if (rows.length > 0) {
        return rows
    }
    else {
        return "Data not found"
    }
}

const find_in_blog = async()=>{
    let rows = [];
    rows = await awaitquery("SELECT * FROM project.blog;");
    if (rows.length == 0) {
        return "Data not found";
    } else {
        return rows;
    }
}

const find_in_blog_id = async()=>{
    let rows = [];
    rows = await awaitquery(`SELECT * FROM project.blog where blog_id = '${id}';`);
    if (rows.length == 0) {
        return "Data not found";
    } else {
        return rows;
    }
}

const add_user = async(id,name,email,password)=>{
    let rows = [];
    rows = await awaitquery(`INSERT INTO project.user (user_id, name, email, password) VALUES (${id}, "${name}", "${email}", "${password}");`);
}

const add_blog = async(id,blog_title,blog_description,blog_views,blog_comments,blog_image,blog_time)=>{
    let rows = [];
    rows = await awaitquery(`INSERT INTO project.blog (blog_id, blog_title, blog_description, blog_views, blog_comments, blog_image, blog_time) VALUES (${id}, "${blog_title}", "${blog_description}", ${blog_views}, ${blog_comments}, '${blog_image}','${blog_time}');`);
}

const validate_user = async(email,password)=>{
    let rows=[];
    rows = await awaitquery(`SELECT * FROM project.user where email = '${email}';`)
    if (rows.length == 0) {
        return false;
    } else if (rows[0].password == password) {
        return true;
    } else {
        return rows;
    }
}

app.get("/getBlogData",async(req,resp)=>{
    let data = await find_in_blog();
    resp.send(data)
})

app.get("/getData", async (req, resp) => {
    let data = await find_in_product();
    resp.send(data);
})

app.get("/getBlogDataUsingId",async(req,resp)=>{
    let data = await find_in_blog_id(req.query.id);
    resp.send(data)
})

app.get("/getDataUsingId", async (req, resp) => {
    let id = req.query.id;
    let data = await find_in_product_id(id);
    resp.send(data);
})

app.post("/addBlog",upload.any(),async(req,resp)=>{
    let month = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"]
    let temp = await find_in_blog();
    let id = temp.length + 1;
    let d = new Date();
    let blog_time = d.getDate()+" "+month[d.getMonth()] + " " + d.getFullYear();
    let views = Math.floor(Math.random()*(1000+1));
    let comments = Math.floor(Math.random()*(views-0+1));
    let data = await add_blog(id,req.body.title,req.body.description,views,comments,`/files/file_${id}.jpg`,blog_time)
    resp.send(data)
})

app.post("/addUser",async(req,resp)=>{
    let temp = await find_in_user();
    let id = temp.length + 1;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let data = await add_user(id,name,email,password);
    // resp.send(data);
})
// 
app.post("/validateUser",async(req,resp)=>{
    let email = req.body.email;
    let password = req.body.password;
    let data= await validate_user(email,password)
    resp.send(data);
})

app.listen(port,()=>{
    console.log(`Server running at: http://localhost:${port}/`);
})