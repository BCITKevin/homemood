import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

async function getRoomAmount() {
  const res = await api.rooms['room-amount'].$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-room-amount'],
    queryFn: getRoomAmount,
  })

  if (error) return 'An error has occurred: ' + error.message

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Rooms</CardTitle>
          <CardDescription>The total rooms that registered are</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? '...' : data.rooms}</CardContent>
      </Card>
    </>
  )
}
