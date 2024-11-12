import { createFileRoute } from '@tanstack/react-router'
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute('/library')({
    component: Library,
})

async function getAllRooms() {
    const res = await api.rooms.$get();
    if (!res.ok) {
        throw new Error("server error");
    }
    const data = await res.json();
    return data;
}

function Library() {
    const { isPending, error, data } = useQuery({ queryKey: ['get-all-rooms'], queryFn: getAllRooms })


    if (error) return 'An error has occurred: ' + error.message
    return (
        <>
            <div className="p-2 max-w-3xl m-auto">
                <Table>
                    <TableCaption>A list of public rooms.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Room Title</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead className="text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPending
                            ? Array(4).fill(0).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium"><Skeleton className="h-4" /></TableCell>
                                    <TableCell><Skeleton className="h-4" /></TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline"><Skeleton className="h-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            : data?.rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.title}</TableCell>
                                    <TableCell>{room.username}</TableCell>
                                    <TableCell>
                                        <div style={{
                                            width: `${room.width * 50}px`,
                                            height: `${room.height * 50}px`,
                                            backgroundColor: 'black',
                                        }}></div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline">Copy</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}


