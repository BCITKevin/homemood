'use client';

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, type ChangeEvent } from 'react';
import { Button } from "@/components/ui/button"
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import { api } from "@/lib/api";


export const Route = createFileRoute('/create-room')({
  component: CreateRoom,
})

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

function CreateRoom() {
  const [roomname, setRoomname] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      title: '',
      width: 10,
      height: 10,
      image: null,
    },
    onSubmit: async ({ value }) => {
      await new Promise(r => setTimeout(r, 3000));

      const res = await api.rooms.$post({ json: value });
      if (!res.ok) {
        throw new Error('Server Error');
      }
      console.log(value);
      navigate({ to: '/library' });
    }
  })

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setRoomname(e.target.value);
  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => setWidth(Number(e.target.value) * 100);
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => setHeight(Number(e.target.value) * 100);
  const handleImageChange = async (e: any) => {
    const file = e.target.files[0]

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      if (reader.readyState === 2) {
        const imgUrl = e.target?.result as string | null;
        setImage(imgUrl);
      }
    }
  }

  return (
    <>
      {/* <form.Provider> */}
      <form
        className="mt-5 ml-6 border-b-white"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <form.Field
            name='title'
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Name your Room</Label>
                <Input type="text" placeholder="name" id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {
                  handleNameChange(e);
                  field.handleChange(e.target.value);
                }} />
                <FieldInfo field={field} />
              </>
            )} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <form.Field
            name='width'
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Width</Label>
                <Input type="number" placeholder="width(m)" id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {
                  handleWidthChange(e);
                  field.handleChange(Number(e.target.value));
                }} />
                <FieldInfo field={field} />
              </>
            )} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <form.Field
            name='height'
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Height</Label>
                <Input type="number" placeholder="height(m)" id={field.name} name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {
                  handleHeightChange(e);
                  field.handleChange(Number(e.target.value));
                }} />
                <FieldInfo field={field} />
              </>
            )} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <form.Field
            name='image'
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Add Pattern</Label>
                <Input type="file" placeholder="file" id={field.name} name={field.name} onBlur={field.handleBlur} onChange={(e) => {
                  handleImageChange(e);
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  field.handleChange(() => null);
                }} />
                <FieldInfo field={field} />
              </>
            )} />
        </div>

        <div className='mt-5'>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="bg-green-200 text-black hover:bg-green-300"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
      {/* </form.Provider> */}
      <div className="border-b-2 border-b-black mt-2 ml-5 mr-5"></div>

      <h2 className="text-center mt-5 text-2xl font-bold">{roomname} Preview</h2>

      <div className="flex justify-center items-center mt-5">
        <div
          className="bg-blue-200"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 200, 150, 0.5))`,
          }}
        >
          {image ? (
            <div className="w-full h-full">
              <img src={image} alt="room pattern image" className="w-full h-full object-cover" />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
