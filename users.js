const users = []

const addUser =({id, name, room})=>{
name = name.trim().toLowerCase()//trim removes space between the words
room = room.trim().toLowerCase()

const user = { id, name, room}
users.push(user)
return {user}
}

const removeUser = (id)=>{
const index = users.findIndex((user)=>user.id == id)
if(index !== -1){
   return users.splice(index, 1[0]) //removes user
}
}

const getUser = (id) => users.find((user) => user.id===id)




module.exports ={
   addUser,
   removeUser,
   getUser,
   
}