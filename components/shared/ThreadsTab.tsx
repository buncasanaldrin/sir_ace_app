import { redirect } from "next/navigation";

import { ThreadCard } from "@/components/cards";
import { fetchUserPosts } from "@/lib/mongoose/actions/user.actions";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: "User";
}

const ThreadsTab: React.FC<ThreadsTabProps> = async ({
  currentUserId,
  accountId,
  accountType,
}) => {
  // TODO: Fetch profile threads
  const result = await fetchUserPosts(accountId);

  if (!result) redirect("/");

  return (
    <section className="flex flex-col mt-9 gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
