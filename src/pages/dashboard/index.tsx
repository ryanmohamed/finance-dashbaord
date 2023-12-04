import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/server/auth';
import { db } from '@/server/db';
import type { UserModel } from "@/server/models";
import CategoryTable from '@/components/categories';


export const getServerSideProps = (async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
    }
    
    const user: (UserModel | null) = await db.user.findUnique({
        where: {
            id: session.user.id
        },
       select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        categories: {
            select: {
                id: true,
                name: true,
                priority: true,
                userId: true
            }
        }
       }
    });

    if (!user) {
        return {
          redirect: { 
            destination: '/',
            permanent: false,
          },
        }
    }

    return { props: { user } };

}) satisfies GetServerSideProps<{
    user: UserModel
}>


export default function Page({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <main className="default-p-x">
            <CategoryTable categories={user.categories} />
        </main>
    );
}