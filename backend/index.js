const express = require('express')
const fs= require('fs')
const cors=require('cors')
require('dotenv').config()

const Port=process.env.Port||3001

const app=express()
app.use(express.json())
app.use(cors())

let rawdata = fs.readFileSync('./data.json');
let todos = [];
try {
    todos = JSON.parse(rawdata);
} catch (err) {
    console.error('Error parsing JSON data:', err);
    todos = [];
}

app.get('/show',(req,res)=>{
    res.json(todos)
})

app.post('/addtodo',(req,res)=>{
    const {todo}=req.body

    if(!todo){
        return res.json({'message': "kya karna hai lik to sahi bhai "})
    }
    if(todos.find((i)=> i.todo==todo)){
       return res.json({'message':'phele wala to pura karle laddar 🫡'})
    }

    todos.push({todo});

    fs.writeFileSync('./data.json',JSON.stringify(todos,null,2))
    res.json({"message":"add kardiya"})
})

app.put('/edittodo/:i',(req,res)=>{
    const oldTodo = req.params.i;
    const {todo} = req.body;
    
    if(!todo){
        return res.json({message:'kya bdalna hai?'})
    }
    
    const todoIndex = todos.findIndex((e) => e.todo === oldTodo);
    
    if(todoIndex === -1){
        return res.json({message:'ye todo nahi mila'})
    }
    
    todos[todoIndex] = {todo};
    fs.writeFileSync('./data.json', JSON.stringify(todos, null, 2))
    res.json({message:'update kar diya'})
})

app.delete('/deletetodo/:i',(req,res)=>{
    const todoToDelete = req.params.i;
    
    const todoIndex = todos.findIndex((e) => e.todo === todoToDelete);
    
    if(todoIndex === -1){
        return res.json({message:'ye todo nahi mila'})
    }
    
    todos.splice(todoIndex, 1);
    fs.writeFileSync('./data.json', JSON.stringify(todos, null, 2))
    res.json({message:'delete kar diya'})
})

app.listen(Port,()=>{
    console.log(`🚀 Server running at http://localhost:${Port}`)
})