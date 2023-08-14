import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";
// u nextjs param od url dobivamo tako da {} destrukturiamo dobijemo params tipa params koji je string te unutar njega imamo id
const  Page = async ({params}: {params: {id: string}}) => {
    if (!params.id ) return null;
    const user = await currentUser();
    if(!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect ('/onboarding');

    // pomocu ovoga znam koji thread ide po redu i dobivam dolje props za threadcard componenu
    const thread = await fetchThreadById(params.id);
    return(
        <section className="relative">
            <div>
            <ThreadCard
            id={thread._id}
            key={thread._id}
            currentUserId={user?.id || ""} 
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            cummunity={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            />
            </div>
            <div className="mt-7">
                <Comment 
                threadId={thread.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {thread.children.map((childItem: any) =>(
                    <ThreadCard 
                    id={childItem._id}
                    key={childItem._id}
                    currentUserId={user?.id || ""} 
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    cummunity={childItem.community}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment
                    />
                ))}

            </div>
        </section>
    )
}

export default Page;