"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "../database";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserParams): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    console.error(`Failed to create/update user: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    } else {
      throw new Error("Failed to create/update user");
    }
  }
}

export async function fetchUser(userId: string) {
  connectToDB();

  try {
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "Community"
    // })
  } catch (error) {
    console.error(`Failed to fetch user: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    } else {
      throw new Error("Failed to fetch user");
    }
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchUsersParams) {
  connectToDB();

  try {
    const skipCount = (pageNumber - 1) * pageSize;
    const sortOptions = { createdAt: sortBy };
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipCount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipCount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error(`Failed to fetch users: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    } else {
      throw new Error("Failed to fetch users");
    }
  }
}

export async function fetchUserPosts(userId: string) {
  connectToDB();

  try {
    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return threads;
  } catch (error) {
    console.error(`Failed to fetch user posts: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user posts: ${error.message}`);
    } else {
      throw new Error("Failed to fetch user posts");
    }
  }
}

export async function fetchActivities(userId: string) {
  connectToDB();

  try {
    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

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
    console.error(`Failed to fetch activity: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch activity: ${error.message}`);
    } else {
      throw new Error("Failed to fetch activity");
    }
  }
}
