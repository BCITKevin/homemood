import { hc } from "hono/client";
import { type ApiRoutes } from "@server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateRoom, type CreateRoomFurniture } from '@server/sharedTypes';

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
    console.log(data);
    return data
  }

export const getAllRoomsQueryOptions = queryOptions({
  queryKey: ['get-all-rooms'],
  queryFn: getAllRooms,
}) 

export async function getAllRoomsForCreate() {
    const res = await api.rooms.getAllRooms.$get();
    if (!res.ok) {
      throw new Error('server error')
    }
    const data = await res.json()
    console.log(data);
    return data
  }

export const getAllRoomsForCreateQueryOptions = queryOptions({
  queryKey: ['get-all-rooms-create'],
  queryFn: getAllRoomsForCreate,
}) 

export async function createRoom({ value }: { value: CreateRoom }) {
  const res = await api.rooms.$post({ json: value })
  if (!res.ok) {
    throw new Error('Server Error')
  }

  const newRoom = await res.json();
  return newRoom;
}

export async function getUserRoom() {
  const res = await api.rooms.getUserRooms.$get();

  const rooms = await res.json();
  return rooms;
}

export async function getAllRoomFurniture() {
  const res = await api.roomFurniture.$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data;
}

export const getAllRoomsFurnitureQueryOptions = queryOptions({
  queryKey: ['get-room-furniture'],
  queryFn: getAllRoomFurniture,
})

export async function createFurniture({ value }: { value: CreateRoomFurniture }) {
  const res = await api.roomFurniture.$post({ json: value })
  if (!res.ok) {
    throw new Error('server Error');
  }
  
  const newData = await res.json();
  return newData;
}

export async function getAllFurnitures() {
  const res = await api.furniture.$get();
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data;
}

export async function getARoom(id: string) {
  if (!id) {
    throw new Error('Unexpected error occured.');
  }
  
  const res = await api.rooms[":id{[0-9]+}"].$get({
    param: { id },
  })

  if (!res.ok) {
    throw new Error('Server Error');
  }

  const aRoom = await res.json();

  return aRoom;
}

export async function deleteRoom(id: string) {
  const res = await api.rooms[":id{[0-9]+}"].$delete({
    param: { id },
  })

  const data = res.json();

  return data;
}

export async function getRoomDataWithRoomFurniture(roomFurniture: CreateRoomFurniture) {
  const res = await api.rooms["room-roomFurniture"].$post({
    json: roomFurniture,
  })

  const data = await res.json();

  console.log(data);

  return data;
}

export const loadingCreateFurnitureQueryOptions = queryOptions<{
  room?: CreateRoomFurniture
}>({
  queryKey: ['loading-create-furniture'],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
})
