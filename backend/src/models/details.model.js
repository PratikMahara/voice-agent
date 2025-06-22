import mongoose from "mongoose";

const detailsSchema=new Schema({
jobposition:{
type:String,
required:true,
lowercase:true
},


},
    {timestamps:true})