import Link from "next/link";
import Image from "next/image";

interface Props{
id: string;
currentUserId: string,
parentId: string | null,
content: string;
author:{
    name: string;
    image: string,
    id: string;
}
cummunity: {
    id: string;
    name: string;
    image: string;
} | null;
createdAt: string;
comments: {
    author: {
        image:string;
    }
}[]
isComment?: boolean;
}

const ThreadCard = ({
id,
currentUserId,
parentId,
content,
author,
cummunity,
createdAt,
comments,
isComment,
}: Props) => {
    return (
                        // dinamicki nacin
<article className={`flex w-full flex-col bg-dark-2 rounded-xl p-7 ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
    <div className="flex items-start justify-between">
     <div className="flex w-full flex-1 flex-row gap-4">
        <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative w-11 h-11">
            <Image src={author.image}
            alt="profile_pictue"
            fill
            className="cursor-pointer rounded-full"
            />
            </Link>
            <div className="thread-card_bar"/>
        </div>
        <div className="flex w-full flex-col">
           <Link href={`/profile/${author.id}`} className="w-fit">
                    <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
            </Link>

            <p className={`${isComment && 'mb-10'}mt-2 text-small-regular text-light-2`}>{content}</p>
            <div className="mt-2 flex flex-col gap-3.5">
                <div className="flex gap-5">
                <Image src="/assets/heart-gray.svg" alt="heart icon" width={24} height={24} className="cursor-pointer
                 object-contain"/>
                 <Link href={`/thread/${id}`}>
                 <Image src="/assets/reply.svg" alt="reply" width={24} height={24} className="cursor-pointer
                 object-contain"/>
                 </Link>
                 <Image src="/assets/repost.svg" alt="repost icon" width={24} height={24} className="cursor-pointer
                 object-contain"/>
                 <Image src="/assets/share.svg" alt="share icon" width={24} height={24} className="cursor-pointer
                 object-contain"/>
                </div>
                
                {isComment && comments.length >  0 &&(
                    <Link href={`/thread/${id}`}>
                        <p className="mt-1 text-small-medium text-gray-1">{comments.length} replies</p>
                    </Link>
                )}
            </div>
        </div>
     </div>
    </div>
       
</article>
    )
} 

export default ThreadCard;