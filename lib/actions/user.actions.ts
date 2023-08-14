"use server"
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectedToDb } from "./mongoose"
import Thread from "../models/thread.model";
import { Children } from "react";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}


// return propis tipa void
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
  } : Params  ): Promise <void> {
 connectedToDb();
try {
 await User.findOneAndUpdate(
    {id: userId},
    {username: username.toLowerCase(),
    name,
    bio,
    image,
    onboarded: true,
},
// upsert mean update and insert
    {upsert: true},
    );

    if(path === '/profile/edit') {
        revalidatePath(path);
    }
    
} catch (error: any) {
    throw new Error(`Failed to create/update ${error.message}`);
}

}

export async function fetchUser(userId:string) {
    try {
        connectedToDb();
        return await User.findOne({id: userId})
        //.populate({path: 'communities', model: Community});
    } catch (error: any) {
        throw new Error(`Failed to fetch user ${error.message}`)
    }
}


export async function fetchUserPosts(userId: string) {
    connectedToDb();
    try {
        const threads = await User.findOne({id: userId})
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: User,
                select: "name image id"
            }
        })

        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch userposts ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
    // define types of params (?: means optional)
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;

}) {
    try {
        connectedToDb();
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i"); // "i" znaci caseInsensitive

        const query: FilterQuery<typeof User> = {
            id: {$ne: userId} // {$ne: userId} means notEquals to userId
        };

        if(searchString.trim() !== ''){
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        };

        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

                // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCoount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCoount > skipAmount + users.length;

    return {users, isNext}
    } catch (error: any) {
        throw new Error(`Failed to fetch users ${error.message}`)
    }
}


export async function getActivity(userId: string) {
    try {
      connectedToDb();
  
      // Find all threads created by the user
      const userThreads = await Thread.find({ author: userId });
  
      // Collect all the child thread ids (replies) from the 'children' field of each user thread
      const childThreadIds = userThreads.reduce((acc, userThread) => {
        return acc.concat(userThread.children);
      }, []);
  
      // Find and return the child threads (replies) excluding the ones created by the same user
      const replies = await Thread.find({
        _id: { $in: childThreadIds },
        author: { $ne: userId }, // Exclude threads authored by the same user
      }).populate({
        path: "author",
        model: User,
        select: "name image _id",
      });
  
      return replies;
    } catch (error) {
      console.error("Error fetching replies: ", error);
      throw error;
    }
  }