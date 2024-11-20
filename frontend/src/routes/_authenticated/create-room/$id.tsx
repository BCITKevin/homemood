import { createFileRoute, useParams } from '@tanstack/react-router'
import { getARoom } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/create-room/$id')({
  loader: async ({ params }) => {
    const a = await fetchRoom(params.id);

    console.log(a);
  },
  component: RouteComponent,
})

async function fetchRoom(id: string) {
  const room = await getARoom(id);
  return room;
}

function RouteComponent() {
  const params = useParams({ from: Route.id })
  // console.log('params:', params)

  return (
    <div>
      <p>If you see this msg, then you are good to go to the next step</p>
    </div>
  )
}

export default Route