import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-room')({
  component: CreateRoom,
})

function CreateRoom() {
  return <div className="p-2">Create Room here!</div>
}
