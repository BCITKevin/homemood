import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateRoom } from '@server/sharedTypes';

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getCurrentUser() {
    const res = await api.me.$get();
    if (!res.ok) {
        throw new Error("server error");
    }
    const data = await res.json();
    return data;
}

export const userQueryOptions = queryOptions({ 
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
})

export async function getAllRooms() {
    const res = await api.rooms.$get()
    if (!res.ok) {
      throw new Error('server error')
    }
    const data = await res.json()
    return data
  }

export const getAllRoomsQueryOptions = queryOptions({
    queryKey: ['get-all-rooms'],
    queryFn: getAllRooms,
  }) 

export async function createRoom({ value }: { value: CreateRoom }) {
    const res = await api.rooms.$post({ json: value })
    if (!res.ok) {
      throw new Error('Server Error')
    }
    
    const newRoom = await res.json();
    return newRoom;
}

export async function getARoom(id: string) {
  if (!id) {
    throw new Error('Unexpected error occured.');
  }

  const res = await api.rooms.$get({
    searchParams: { id },
  })

  if (!res.ok) {
    throw new Error('Server Error');
  }

  const aRoom = await res.json();

  return aRoom;
}