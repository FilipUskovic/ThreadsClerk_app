
"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectedToDb } from "./mongoose";

interface Params {
 text: string,
 author: string,
 communityId: string | null,
 path: string,
}

export  async function CreateThread({text,author,communityId,path}: Params){

    try {
    connectedToDb();
    const createdThread = await Thread.create({
    text,
    author,
    communityId: null,
    path
 });

 // update user model

    await User.findByIdAndUpdate(author,
    {$push: {threads: createdThread._id}})


    revalidatePath(path);
        
    } catch (error: any) {
        throw new Error(`Error creating thread ${error.message}`)
    }

}


export async function fetchPosts(pageNumber = 1 , pageSize = 20){
   try {
    connectedToDb();

    // for pagination
    // calculate the number of posts to skip

    const skipAmount = (pageNumber - 1) * pageSize;

    //Ftech posts that have no parents (top level threads)
    const postsQuery = Thread.find({parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: 'User'})
    .populate({
        path: 'children',
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
})

    const totalPostCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
    const posts = await postsQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;


    return {posts, isNext};

   } catch (error) {
    
   }
}


export async function fetchThreadById(id: string){
    connectedToDb();

    try {
        // TO DO: populate comunnity

        const thread = await Thread.findById(id).populate({path: 'author', model:User, select:"_id id name image"
      })
      .populate({
        path: 'children',
        populate: [
            {
             path: 'author',
             model: User,
             select: "_id id name parentId image"
            },
            {
            path:'children',
            model: Thread,
            populate:{
                path: 'author',
                model: User,
                select: "_id id name parentId image"
            }
            }
        ]
      }).exec();

      return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread ${error.message}`)
    }

}


export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string){
    connectedToDb();
    try {
        // aading comment
        const originalThread = await Thread.findById(threadId);

        if(!originalThread){
            throw new Error("Thread not found");
        } 
        // create new Thread with comment
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })


        // save the new thread to db
        const savedCommentThread = await commentThread.save();

        // update the orginal thread to include the new comment
        originalThread.children.push(savedCommentThread._id);

        // save the origina thread
        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error adding comment to thread ${error.message}`)
    }
}