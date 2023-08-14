"use client"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
 import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/threadValidations";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
    threadId: string,
    currentUserId: string,
    currentUserImg: string
}

const Comment = ({threadId, currentUserId, currentUserImg}: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: ''
        }
});
// values coming from onSubmit react form hooks
 const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

        form.reset();
 }
    return(
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
         className="comment-form"
         >
             <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex w-full items-center gap-3'>
              <FormLabel>
                <Image
                src={currentUserImg}
                alt="picture"
                width={48}
                height={48}
                className="rounded-full object-cover"
                
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                type="text"
                placeholder="Comment..."
                className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500 comment-form_btn">
            Post Comment
        </Button>
         </form>
        </Form>
    )
}

export default Comment;