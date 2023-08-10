"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/ui";
import { createThread } from "@/lib/mongoose/actions/thread.actions";
import { ThreadValidation } from "@/lib/validations";

interface PostThreadProps {
  userId: string;
}

const PostThread: React.FC<PostThreadProps> = ({ userId }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof ThreadValidation>
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });

      router.push("/");
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start mt-10 gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  {...field}
                  className="border border-dark-4 bg-dark-3 text-light-1 no-focus resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500" disabled={isLoading}>
          Post Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
