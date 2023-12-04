import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const priorities: string[] = ["Low Priority", "Medium Priority", "High Priority", "Extreme Priority"];

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  priority: z.enum(["Low Priority", "Medium Priority", "High Priority", "Extreme Priority"])
});

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { CategoryModel } from "@/server/models";
import { toast } from "./ui/use-toast";

import { TrashIcon } from "@radix-ui/react-icons";


export default function CategoryTable ({ categories }: { categories: CategoryModel[] }) {
    
    const [ categoryList, setCategoryList ] = useState(categories);
    
    const handleDelete = async (id: string) => {
        const response = await fetch("/api/category/delete", { 
            method: "POST", 
            body: JSON.stringify({ id })
        });
        if (response.status !== 200) {
            toast({
                title: "Failed to delete category.",
                description: "Server responded with failed response."
            })
            return;
        }
        const filtered = categoryList.filter(c => c.id !== id);
        setCategoryList(filtered);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          priority: "Low Priority"
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        form.reset();
        const response = await fetch("/api/category/create", { 
            method: "POST", 
            body: JSON.stringify(values)
        });
        if (response.status !== 200) {
            toast({
                title: "Failed to add category.",
                description: "Server responded with failed response."
            })
            return;
        }

        try {
            const data = (await response.json()) as { categories: CategoryModel[] };
            console.log(data.categories)
            setCategoryList(data.categories);
            toast({
                title: "Successfully added category."
            })
        }
        catch (e) {
            toast({ 
                title: "Could not refresh table.", 
                description: "Failed to interpret server response after write operation."
            });
            return;
        }
    }
    
    return (
    <div className="w-[300px] flex flex-col">
        { categoryList.length !== 0 ? <>
            <Table className="border-[1px] border-gray-600/10">
            <TableHeader>
            <TableRow>
                <TableHead className="w-1/3">Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {categoryList.map((category, i) => (
                <TableRow key={i}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.priority}</TableCell>
                    <TableCell>
                    <AlertDialog>
                        <AlertDialogTrigger className="btn btn-outline btn-icon rounded-full">
                            <TrashIcon />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this category from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table> 
        </> : <div>
            <h4 className="text-center text-stone-900 font-medium text-xl">Oops!</h4>
            <p className="text-center text-sm text-gray-800">Looks like you don&apos;t have any categories yet.</p>
        </div>}
        <Popover>
            <PopoverTrigger className="mt-2 btn btn-outline btn-base w-1/2 self-center">
                Add Category
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Food" {...field} />
                            </FormControl>
                            <FormDescription>
                                Name of the category.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                        <FormItem className="mb-6">
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a priority level" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    { priorities.map(p => <SelectItem value={p} key={p}>{p}</SelectItem>) }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    </div>
  )
}
