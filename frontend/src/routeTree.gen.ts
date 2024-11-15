/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LibraryImport } from './routes/library'
import { Route as CreateRoomImport } from './routes/create-room'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const LibraryRoute = LibraryImport.update({
  id: '/library',
  path: '/library',
  getParentRoute: () => rootRoute,
} as any)

const CreateRoomRoute = CreateRoomImport.update({
  id: '/create-room',
  path: '/create-room',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/create-room': {
      id: '/create-room'
      path: '/create-room'
      fullPath: '/create-room'
      preLoaderRoute: typeof CreateRoomImport
      parentRoute: typeof rootRoute
    }
    '/library': {
      id: '/library'
      path: '/library'
      fullPath: '/library'
      preLoaderRoute: typeof LibraryImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/create-room': typeof CreateRoomRoute
  '/library': typeof LibraryRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/create-room': typeof CreateRoomRoute
  '/library': typeof LibraryRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/create-room': typeof CreateRoomRoute
  '/library': typeof LibraryRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/create-room' | '/library'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/create-room' | '/library'
  id: '__root__' | '/' | '/create-room' | '/library'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CreateRoomRoute: typeof CreateRoomRoute
  LibraryRoute: typeof LibraryRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CreateRoomRoute: CreateRoomRoute,
  LibraryRoute: LibraryRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/create-room",
        "/library"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/create-room": {
      "filePath": "create-room.tsx"
    },
    "/library": {
      "filePath": "library.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
