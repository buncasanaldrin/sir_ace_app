"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@/components/ui";
import { addCommentToThread } from "@/lib/mongoose/actions/thread.actions";
import { CommentValidation } from "@/lib/validations";

interface CommentProps {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment: React.FC<CommentProps> = ({
  threadId,
  currentUserImage,
  currentUserId,
}) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CommentValidation>
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await addCommentToThread({
        threadId,
        commentText: values.thread,
        userId: currentUserId,
        path: pathname,
      });

      form.reset();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImage}
                  alt="profile image"
                  height={48}
                  width={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn" disabled={isLoading}>
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
