'use client'

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import { createRoom, getAllRoomsForCreateQueryOptions } from '@/lib/api'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createRoomSchema } from '@server/sharedTypes'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/create-room/')({
    component: CreateRoom,
})

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

function CreateRoom() {
    const [roomname, setRoomname] = useState<string | null>(null)
    const [width, setWidth] = useState<number>(20)
    const [height, setHeight] = useState<number>(20)
    const [isPrivate, setIsPrivate] = useState(false)

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const form = useForm({
        validatorAdapter: zodValidator(),
        defaultValues: {
            title: '',
            width: '1',
            height: '1',
            isPrivate: false,
        },
        onSubmit: async ({ value }) => {
            // loading state
            queryClient.setQueryData(['loading-create-room'], { room: value })
            try {
                const newRoom = await createRoom({ value })

                const existingRooms = await queryClient.ensureQueryData(
                    getAllRoomsForCreateQueryOptions,
                )

                queryClient.setQueryData(getAllRoomsForCreateQueryOptions.queryKey, {
                    ...existingRooms,
                    rooms: [newRoom, ...existingRooms.rooms],
                })
                navigate({ to: `/create-room/${newRoom.id}` })
                // success state
            } catch (error) {
                // error state
            } finally {
                queryClient.setQueryData(['loading-create-room'], {})
            }
        },
    })

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
        setRoomname(e.target.value)
    const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) < 1) {
            setWidth(5)
        } else {
            setWidth(Number(e.target.value) * 20)
        }
    }
    const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) < 1) {
            setHeight(5)
        } else {
            setHeight(Number(e.target.value) * 20)
        }
    }

    return (
        <>
            <form
                className="flex flex-col gap-y-4 mt-5 ml-6 border-b-white"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <form.Field
                        name="title"
                        validators={{
                            onChange: createRoomSchema.shape.title,
                        }}
                        children={(field) => (
                            <div>
                                <Label htmlFor={field.name}>Name your Room</Label>
                                <Input
                                    type="text"
                                    placeholder="name"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        handleNameChange(e)
                                        field.handleChange(e.target.value)
                                    }}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <form.Field
                        name="width"
                        validators={{
                            onChange: createRoomSchema.shape.width,
                        }}
                        children={(field) => (
                            <div>
                                <Label htmlFor={field.name}>Width</Label>
                                <Input
                                    type="number"
                                    placeholder="width(m)"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        handleWidthChange(e)
                                        field.handleChange(e.target.value)
                                    }}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <form.Field
                        name="height"
                        validators={{
                            onChange: createRoomSchema.shape.height,
                        }}
                        children={(field) => (
                            <div>
                                <Label htmlFor={field.name}>Height</Label>
                                <Input
                                    type="number"
                                    placeholder="height(m)"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                        handleHeightChange(e)
                                        field.handleChange(e.target.value)
                                    }}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />
                </div>

                <div className="flex items-center space-x-2 mt-5">
                    <form.Field
                        name="isPrivate"
                        validators={{
                            onChange: createRoomSchema.shape.isPrivate,
                        }}
                        children={(field) => (
                            <div>
                                <Switch
                                    id={field.name}
                                    name={field.name}
                                    checked={isPrivate}
                                    onBlur={field.handleBlur}
                                    onCheckedChange={() => {
                                        const newValue = !isPrivate
                                        setIsPrivate(newValue)
                                        field.handleChange(newValue)
                                    }}
                                />
                                <FieldInfo field={field} />
                                <Label htmlFor={field.name}>Private</Label>
                            </div>
                        )}
                    />
                </div>

                <div className="mt-5">
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700"
                                disabled={!canSubmit}
                            >
                                {isSubmitting ? 'Continuing...' : 'Continue'}
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
            <div className="border-b-2 border-b-black mt-2 ml-5 mr-5"></div>

            <h2 className="text-center mt-5 text-2xl font-bold">
                {roomname} Preview
            </h2>

            <div className="relative mt-5 flex justify-center items-center">
                <div className="absolute top-[-20px] text-sm text-gray-700">
                    {width / 20}m
                </div>
                <div
                    className="grid gap-1 border-8 border relative"
                    style={{
                        gridTemplateColumns: `repeat(${width}, 1fr)`,
                        gridTemplateRows: `repeat(${height}, 1fr)`,
                        width: `${width}`,
                        height: `${height}`,
                        background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
          `,
                        backgroundSize: '40px 40px',
                    }}
                ></div>
                <div className="absolute right-[-20px] ml-5 text-sm text-gray-700">
                    {height / 20}m
                </div>
            </div>
        </>
    )
}
