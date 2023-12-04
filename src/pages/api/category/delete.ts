import { authOptions } from '@/server/auth'
import { db } from '@/server/db'
import { CategoryModel } from '@/server/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';

type Data = {
    id: string
}

type ResponseData = {
  categories: CategoryModel[]
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method !== "POST") {
        res.status(400).end();
        return;
    }

    const session = await getServerSession(req, res, authOptions);
    if(!session) {
        res.status(401).end();
        return;
    }

    if (typeof req.body !== "string") {
        res.status(401).end();
        return;
    }
    try { 
        const data: Data = JSON.parse(req.body) as Data;
        if (!data.id) {
            throw new Error("ID field missing in request body.");
            return;
        }

        const write = await db.category.delete({
            where: {
               id: data.id,
            },
        })
        console.log(write)
        res.status(200).end();

        return;
    }
    catch (e) {
        console.log("Error occured while parsing request body for category create.");
        res.status(400).end();
        return;
    }
}