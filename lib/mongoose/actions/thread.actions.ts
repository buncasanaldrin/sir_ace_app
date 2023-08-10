"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../database";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

interface AddCommentToThreadParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams) {
  try {
    connectToDB();

    const community = await Community.findOne({ id: communityId }, { _id: 1 });

    const createdThread = await Thread.create({
      text,
      author,
      community, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (community) {
      // Update Community model
      await Community.findByIdAndUpdate(community, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.error(`Failed to create/update thread: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to create/update thread: ${error.message}`);
    } else {
      throw new Error("Failed to create/update thread");
    }
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  try {
    const skipCount = (pageNumber - 1) * pageSize;

    // Fetch the top level threads only
    // (top-level threads means no comments)
    const threadsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipCount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id, name parentId image",
        },
      });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipCount + threads.length;

    return { threads, isNext };
  } catch (error) {
    console.error(`Failed to fetch threads: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch threads: ${error.message}`);
    } else {
      throw new Error("Failed to fetch threads");
    }
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    console.error(`Failed to fetch thread by id: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch thread by id: ${error.message}`);
    } else {
      throw new Error("Failed to fetch thread by id");
    }
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: AddCommentToThreadParams) {
  connectToDB();

  try {
    // Find the original thread by it's id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save the new thread
    const savedCommentThread = await commentThread.save();

    // Update the original thread to include the new comment
    originalThread.children.push(savedCommentThread._id);

    // Save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error) {
    console.error(`Failed to add comment to thread: ${error}`);
    if (error instanceof Error) {
      throw new Error(`Failed to add comment to thread: ${error.message}`);
    } else {
      throw new Error("Failed to add comment to thread");
    }
  }
}
