const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

const dataFilePath = './data.json';



const readData = () => {
    const data = fs.readFileSync(dataFilePath)
    return JSON.parse(data);
}

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

// استعراض كل المنشورات
app.get("/posts", (req, res) => {
    const posts = readData();
    res.json(posts)
})

// إنشاء منشور جديد
app.post("/posts",(req,res)=> {
    const posts = readData();
    const newPost = {
        id:posts.length +1,
        title:req.body.title,
        description:req.body.description,
        author:req.body.author,
        data:new Date().toISOString()
    }
    posts.push(newPost);
    writeData(posts);
    res.status(201).json(newPost)
})

// تعديل منشور موجود
app.put("/posts/:id",(req,res)=>{
    const posts = readData();
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post =>post.id === postId)

    if(postIndex === -1 ) {
        return res.status(404).json({message:"post not found"})
    }

    posts[postIndex] = {
        ...posts[postIndex],
        title:req.body.title,
        description:req.body.description,
        author:req.body.author
    };


    writeData(posts);
    res.json(posts[postIndex])
})

//حذف منشور
app.delete("/posts/:id",(req,res)=>{
    const posts = readData();
    const postId = parseInt(req.params.id);
    const updatedPosts = posts.filter(post => post.id !== postId)

    if(posts.length === updatedPosts.length) {
        return res.status(404).json({message:"post not fonud"});       
    }

    writeData(updatedPosts);
    res.json({message:'post deleted'})
})


app.listen(PORT,()=>{
    console.log(`Serverr running on http://localhost:${PORT}`)
})