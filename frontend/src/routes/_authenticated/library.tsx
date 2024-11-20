import { createFileRoute } from '@tanstack/react-router'
import { getAllRoomsQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/library')({
  component: Library,
})

function Library() {
  const { isPending, error, data } = useQuery(getAllRoomsQueryOptions)
  const { data: loadingCreateRoom } = useQuery({
    queryKey: ['loading-create-room'],
  })

  if (error) return 'An error has occurred: ' + error.message
  return (
    <>
      <div className="p-2 max-w-3xl m-auto">
        <Table>
          <TableCaption>A list of public rooms.</TableCaption>
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
            {isPending
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
              : data?.rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.title}</TableCell>
                  <TableCell>{room.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>{room.width}m</TableCell>
                  <TableCell>{room.height}m</TableCell>
                  <TableCell>
                    <div
                      className="grid gap-1 border-8 border relative"
                      style={{
                        width: `${Number(room.width) * 30}px`,
                        height: `${Number(room.height) * 30}px`,
                        background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
                        backgroundSize: "25px 35px",
                      }}
                    ></div>
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
