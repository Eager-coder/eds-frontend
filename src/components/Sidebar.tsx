'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { File, FileArchive, FileStack, FileText, Truck, Users } from 'lucide-react';

const NavLink = ({
	href,
	children,
	icon: Icon
}: {
	href: string;
	children: React.ReactNode;
	icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) => {
	const pathname = usePathname();

	const isActive = pathname.startsWith(href);
	return (
		<Link
			href={href}
			className={`mb-1 flex items-center gap-3 rounded-md p-3 transition ${
				isActive ? 'bg-[#FBEFC2] text-black font-medium' : 'text-gray-700 hover:bg-gray-100'
			}`}
		>
			<Icon className="h-5 w-5" />
			<span>{children}</span>
		</Link>
	);
};

export function Sidebar() {
	const { user, isLoading } = useUser();

	if (isLoading || !user) {
		return (
			<aside className="min-h-screen w-72 max-w-72 min-w-72 flex-1 border-r border-zinc-200 bg-gray-50 p-4">
				{/* Header skeleton */}
				<div className="mb-6 animate-pulse space-y-2">
					<div className="h-6 w-32 rounded bg-gray-200"></div>
					<div className="h-4 w-40 rounded bg-gray-200"></div>
				</div>
				{/* Nav links skeleton */}
				<nav className="space-y-3">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
					))}
				</nav>
			</aside>
		);
	}

	return (
		<aside className="min-h-screen min-w-64 border-r border-zinc-200 bg-gray-50">
			<div className="border-b border-zinc-200 p-4">
				<h2 className="text-lg font-bold">
					{user.firstname} {user.lastname}
				</h2>
				<p className="text-sm text-gray-500">{user.email}</p>
			</div>
			<nav className="p-2">
				{user.role === 'SUPER_ADMIN' && <AdminLinks />}
				{(user.role === 'MANAGER' || user.role === 'SUPER_ADMIN') && <ManagerLinks />}
				{(user.role === 'MANAGER' || user.role === 'SUPER_ADMIN' || user.role === 'USER') && <UserLinks />}
			</nav>
		</aside>
	);
}

function UserLinks() {
	return (
		<div className="my-2 rounded-xs border border-zinc-200 p-3">
			<h2 className="border-b border-zinc-300 pb-3 text-center">User navigation</h2>

			<NavLink href="/initial-declaration" icon={File}>
				Initial Declaration
			</NavLink>

			<NavLink href="/ad-hoc-declarations" icon={FileText}>
				Ad hoc Declarations
			</NavLink>

			<NavLink href="/management-plans" icon={FileArchive}>
				Management Plans
			</NavLink>
		</div>
	);
}

function AdminLinks() {
	return (
		<div className="my-2 rounded-xs border border-zinc-200 p-3">
			<h2 className="border-b border-zinc-300 pb-3 text-center">Admin navigation</h2>
			<NavLink href="/admin/initial-declarations" icon={File}>
				Initial Declaration Builder
			</NavLink>

			<NavLink href="/admin/ad-hoc-categories" icon={FileText}>
				Ad-Hoc Categories
			</NavLink>

			<NavLink href="/admin/management-actions" icon={FileArchive}>
				Management Plan Actions
			</NavLink>
		</div>
	);
}

function ManagerLinks() {
	return (
		<div className="my-2 rounded-xs border border-zinc-200 p-3">
			<h2 className="border-b border-zinc-300 pb-3 text-center">Manager navigation</h2>

			<NavLink href="/users" icon={Users}>
				Users
			</NavLink>
			<NavLink href="/manager/initial-declarations" icon={File}>
				Initial Declarations
			</NavLink>

			<NavLink href="/manager/ad-hoc-declarations" icon={FileText}>
				Ad hoc Declarations
			</NavLink>

			<NavLink href="/manager/management-plans" icon={FileArchive}>
				Management Plans
			</NavLink>
		</div>
	);
}
