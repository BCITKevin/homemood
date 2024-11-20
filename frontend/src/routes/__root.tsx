import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
})

function Navbar() {
    return (
        <div className='p-2 flex justify-between max-w-2xl m-auto items-baseline'>
            <Link to="/">
                <h1 className='text-2xl font-bold'>HoemMood</h1>
            </Link>
            <div className='p-2 flex gap-2'>
                <Link to="/library" className="[&.active]:font-bold">
                    Library
                </Link>
                <Link to="/create-room" className="[&.active]:font-bold">
                    Create
                </Link>
                <Link to="/profile" className="[&.active]:font-bold">
                    Profile
                </Link>
            </div>
        </div>
    )
}

function Root() {
    return (
        <>
            <Navbar />
            <hr />
            <div className='p-2 gap-2 max-w-2xl m-auto'>
                <Outlet />
            </div>
        </>
    )
}