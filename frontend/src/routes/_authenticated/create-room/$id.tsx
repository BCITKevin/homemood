import { useState, useEffect } from 'react';
import { createFileRoute, useLoaderData, useNavigate, useParams } from '@tanstack/react-router';
import { getARoom } from '@/lib/api';
import { type CreateRoom } from '@server/sharedTypes';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
// import { furnitures } from '../../../fakeData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Trash2,
  RotateCwSquare,
  CircleX
} from "lucide-react"
import { useQueryClient } from '@tanstack/react-query'
import { createFurniture, getAllRoomsFurnitureQueryOptions, getAllFurnitures, loadingCreateFurnitureQueryOptions } from '@/lib/api';

export const Route = createFileRoute('/_authenticated/create-room/$id')({
  loader: async ({ params }) => {
    const room = await fetchRoom(params.id);
    return room;
  },
  component: SettingRoom,
});

async function fetchRoom(id: string) {
  const room = await getARoom(id);
  return room;
}

function SettingRoom() {
  const { room }: { room: CreateRoom } = useLoaderData({ from: Route.id });
  const params = useParams({ from: Route.id });
  const [selectedFurniture, setSelectedFurniture] = useState<
    { key: string; id: number; name: string; imageUrl: string; x: number; y: number, isDialogOpen: boolean, rotate: number }[]
  >([]);
  const [furnitures, setFurnitures] = useState<
    { id: number; width: number; height: number; name: string; imageUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFurnitures();
      setFurnitures(data.funitures);
    };

    fetchData();
  }, []);

  const addFurnitureToRoom = (furniture: { id: number; name: string; imageUrl: string }) => {
    const uniqueKey = `${furniture.id}-${Date.now()}`;
    setSelectedFurniture((prev) => [
      ...prev,
      { ...furniture, key: uniqueKey, x: 0, y: 0, isDialogOpen: false, rotate: 0 },
    ]);
  };

  const deleteFurniture = (furnitureKey: string) => {
    const newList = selectedFurniture.filter((furniture) => furniture.key !== furnitureKey);

    setSelectedFurniture(newList);
  }

  const rotateFurniture = (furnitureKey: string) => {
    setSelectedFurniture((prev) =>
      prev.map((furniture) => {
        if (furniture.key === furnitureKey) {
          const newRotate = furniture.rotate + 45;
          return {
            ...furniture,
            rotate: newRotate === 360 ? 0 : newRotate,
          };
        }
        return furniture;
      })
    );
  };

  const handleDiffPos = (furnitureToUpdate: any, newPos: any) => {
    setSelectedFurniture((prev) =>
      prev.map((furniture) =>
        furniture.key === furnitureToUpdate.key
          ? { ...furniture, x: newPos.x, y: newPos.y }
          : furniture
      )
    );
  }

  function handleDialog(furnitureKey: string) {
    setSelectedFurniture((prev) =>
      prev.map((furniture) =>
        furniture.key === furnitureKey
          ? { ...furniture, isDialogOpen: !furniture.isDialogOpen }
          : { ...furniture, isDialogOpen: false }
      )
    );
  }

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const storeToDB = async () => {
    for (const furniture of selectedFurniture) {
      const formatData = {
        key: furniture.key,
        roomId: Number(params.id),
        furnitureId: furniture.id,
        x: furniture.x,
        y: furniture.y,
        rotate: furniture.rotate,
      }

      try {
        const existingData = await queryClient.ensureQueryData(getAllRoomsFurnitureQueryOptions);

        navigate({ to: '/library' });

        // loading state
        queryClient.setQueryData(loadingCreateFurnitureQueryOptions.queryKey, { room: formatData });

        const newData = await createFurniture({ value: formatData });

        queryClient.setQueryData(getAllRoomsFurnitureQueryOptions.queryKey, {
          ...existingData,
          furniture: [newData, ...existingData.furniture],
        })
      } catch (error) {

      } finally {
        queryClient.setQueryData(loadingCreateFurnitureQueryOptions.queryKey, {});
      }
    }
  }

  return (
    <div>
      <h2 className="text-center mt-5 text-2xl font-bold">Arrange the furniture in your room.</h2>
      <h4 className="text-center mt-5 text-gray-400">Drag the furniture to move</h4>
      <div className="relative mt-10 flex justify-center items-center">
        <div className="absolute top-[-20px] text-sm text-gray-700">{Number(room.width)}m</div>
        <div
          className="relative border-8 border"
          style={{
            width: `${Number(room.width) * 100}px`,
            height: `${Number(room.height) * 100}px`,
            background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
            backgroundSize: '40px 40px',
          }}
        >
          {selectedFurniture.map((furniture) => (
            <div key={furniture.key} className="relative">
              <div
                onClick={() => handleDialog(furniture.key)}
                className="window cursor-pointer"
                onPointerDown={(e) => {
                  const initX = e.clientX;
                  const initY = e.clientY;

                  const dragMove = (e: PointerEvent) => {
                    const newDiffPos = {
                      x: furniture.x + e.clientX - initX,
                      y: furniture.y + e.clientY - initY
                    };
                    handleDiffPos(furniture, newDiffPos);
                  };

                  const dragEnd = () => {
                    document.removeEventListener("pointermove", dragMove);
                  };

                  document.addEventListener("pointermove", dragMove);
                  document.addEventListener("pointerup", dragEnd, { once: true });
                }}
                style={{
                  transform: `translateX(${furniture.x}px) translateY(${furniture.y}px)`
                }}
              >
                <img
                  key={furniture.key}
                  src={furniture.imageUrl}
                  alt={furniture.name}
                  className="absolute"
                  style={{
                    top: `${furniture.y}px`,
                    left: `${furniture.x}px`,
                    width: '80px',
                    height: '80px',
                    transform: `rotate(${furniture.rotate}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
              {furniture.isDialogOpen && (
                <DropdownMenu open={furniture.isDialogOpen}>
                  <DropdownMenuContent
                    className="absolute top-full mt-1 w-56"
                  >
                    <DropdownMenuLabel>{furniture.name}'s Interactions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => rotateFurniture(furniture.key)}>
                        <RotateCwSquare className="mr-2" />
                        <span>Rotate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteFurniture(furniture.key)}>
                        <Trash2 className="mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDialog(furniture.key)}>
                        <CircleX className="mr-2" />
                        <span>Close</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
        <div className="absolute right-[-20px] ml-5 text-sm text-gray-700">{Number(room.height)}m</div>
      </div>
      <div className='flex flex-col mt-5'>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Customize your room</DrawerTitle>
                <DrawerDescription>Choose any furniture</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1 text-center">
                    <Carousel className="w-full max-w-xs">
                      <CarouselContent>
                        {furnitures.map((furniture) => (
                          <CarouselItem key={furniture.id}>
                            <div className="text-[0.70rem] uppercase text-muted-foreground">{furniture.name}</div>
                            <div className="p-1">
                              <Card>
                                <CardContent
                                  className="flex aspect-square items-center justify-center p-6 cursor-pointer"
                                  onClick={() => addFurnitureToRoom(furniture)}
                                >
                                  <img src={furniture.imageUrl} alt={furniture.name} />
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className='fixed bottom-4 right-8'>
        <Button onClick={storeToDB}>
          Submit
        </Button>
      </div>
    </div>
  );
}

export default Route;
