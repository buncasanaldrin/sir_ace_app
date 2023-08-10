import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { PostThread } from "@/components/forms";
import { fetchUser } from "@/lib/mongoose/actions/user.actions";

const CreateThreadPage: React.FC = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Threads</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
};

export default CreateThreadPage;
