import type {
    User,
    Category
} from "@prisma/client";
 
export type { User, Category }
export type CategoryModel = Omit<Category, "createdAt" | "updatedAt">;
export type UserModel = User & { categories: CategoryModel[] }