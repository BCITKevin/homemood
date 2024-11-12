import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: Root,
})

function Navbar() {
    return (
        <div className='p-2 flex gap-2'>
            <Link to="/" className="[&.active]:font-bold">
                Home
            </Link>{' '}
            <Link to="/library" className="[&.active]:font-bold">
                Library
            </Link>
            <Link to="/create-room" className="[&.active]:font-bold">
                Create
            </Link>
        </div>
    )
}

function Root() {
    return (
        <>
            <Navbar />
            <hr />
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
        </>
    )
}