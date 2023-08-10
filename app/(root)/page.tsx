import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ThreadCard } from "@/components/cards";
import { Pagination } from "@/components/shared";
import { fetchThreads } from "@/lib/mongoose/actions/thread.actions";
import { fetchUser } from "@/lib/mongoose/actions/user.actions";

interface HomeProps {
  searchParams: { [key: string]: string | undefined };
}

const Home: React.FC<HomeProps> = async ({ searchParams }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchThreads(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="flex flex-col gap-10 mt-9">
        {result?.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
};

export default Home;
