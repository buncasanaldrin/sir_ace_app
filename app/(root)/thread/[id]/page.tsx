import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ThreadCard } from "@/components/cards";
import { Comment } from "@/components/forms";
import { fetchThreadById } from "@/lib/mongoose/actions/thread.actions";
import { fetchUser } from "@/lib/mongoose/actions/user.actions";

interface ThreadDetailsPageProps {
  params: {
    id: string;
  };
}

const ThreadDetailsPage: React.FC<ThreadDetailsPageProps> = async ({
  params,
}) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) return redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={userInfo._id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImage={userInfo.image}
          currentUserId={userInfo._id}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((threadChild: any) => (
          <ThreadCard
            id={threadChild._id}
            currentUserId={userInfo._id}
            parentId={threadChild.parentId}
            content={threadChild.text}
            author={threadChild.author}
            community={threadChild.community}
            createdAt={threadChild.createdAt}
            comments={threadChild.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadDetailsPage;
