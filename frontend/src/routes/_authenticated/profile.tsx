import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueryOptions, getUserRoom, deleteRoom } from '@/lib/api'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface Room {
    roomId: number;
    roomTitle: string;
    roomWidth: number;
    roomHeight: number;
    isPrivate: boolean;
    createdAt: string;
    furnitures: {
        furnitureId: number;
        furnitureX: number;
        furnitureY: number;
        furnitureRotate: number;
        furnitureName: string;
        furnitureImageUrl: string;
    }[];
}

export const Route = createFileRoute('/_authenticated/profile')({
    component: Profile,
})

function Profile() {
    const { isPending, error, data } = useQuery(userQueryOptions)
    const [rooms, setRooms] = useState<Room[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getUserRoom();
            setRooms(data.rooms);
            setLoading(false);
        }
        fetchData();
    }, [])

    async function hanldeDelete(id: string) {
        await deleteRoom(id);
    }

    if (isPending) {
        return 'loading'
    }

    if (error) {
        return 'not logged in'
    }

    return (
        <>
            <div className="flex items-center justify-between p-2">
                <div className='flex items-center gap-2'>
                    <Avatar>
                        {data.user.picture && (
                            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
                        )}
                        <AvatarFallback>{data.user.given_name}</AvatarFallback>
                    </Avatar>
                    <p>{data.user.given_name}, {data.user.family_name}</p>
                </div>
                <Button asChild className='my-4'>
                    <a href="/api/logout">Logout</a>
                </Button>
            </div>
            <div>
                <h1 className='text-2xl font-bold'>Your Rooms</h1>
                <Table>
                    <TableCaption>A list of {data.user.given_name}'s rooms.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Room Title</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Width</TableHead>
                            <TableHead>Height</TableHead>
                            <TableHead>Preview</TableHead>
                            <TableHead className="text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array(4)
                                .fill(0)
                                .map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">
                                            <Skeleton className="h-4" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline">
                                                <Skeleton className="h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            : !loading && rooms?.map((room) => (
                                <TableRow key={room.roomId}>
                                    <TableCell>{room.roomTitle}</TableCell>
                                    <TableCell>{room.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell>{room.roomWidth}m</TableCell>
                                    <TableCell>{room.roomHeight}m</TableCell>
                                    <TableCell>
                                        <div
                                            className="grid gap-1 border-8 border relative"
                                            style={{
                                                width: `${Number(room.roomWidth) * 30}px`,
                                                height: `${Number(room.roomHeight) * 30}px`,
                                                background: `
                                                    linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
                                                    linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
                                                `,
                                                backgroundSize: "25px 35px",
                                            }}>
                                            {room.furnitures.map((furniture) => (
                                                <div key={furniture.furnitureId} className="relative">
                                                    <div
                                                        className='window'
                                                        style={{
                                                            transform: `translateX(${furniture.furnitureX}px) translateY(${furniture.furnitureY}px)`
                                                        }}
                                                    >
                                                        <img
                                                            key={furniture.furnitureId}
                                                            src={furniture.furnitureImageUrl}
                                                            alt={furniture.furnitureName}
                                                            className="absolute"
                                                            style={{
                                                                top: `${furniture.furnitureY}px`,
                                                                left: `${furniture.furnitureX}px`,
                                                                width: '80px',
                                                                height: '80px',
                                                                transform: `rotate(${furniture.furnitureRotate}deg)`,
                                                                transformOrigin: "center center",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" onClick={() => hanldeDelete(String(room.roomId))}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
