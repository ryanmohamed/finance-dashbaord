import { authOptions } from '@/server/auth'
import { db } from '@/server/db'
import { CategoryModel } from '@/server/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
 
interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
        "name": string,
        "priority": string
    }
}

type Data = {
    "name": string,
    "priority": string
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
        if (!data.name || !data.priority) {
            throw new Error("Name or priority field missing in request body.");
            return;
        }
        const write = await db.user.update({
            select: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                        priority: true,
                        userId: true
                    }
                }
            },
            where: {
                id: session.user.id
            },
            data: {
                categories: {
                    create: [data]
                }
            }
        });

        const categories: CategoryModel[] = write.categories;
        res.status(200).json({ categories });
        return;
    }
    catch (e) {
        console.log("Error occured while parsing request body for category create.");
        res.status(400).end();
        return;
    }
}