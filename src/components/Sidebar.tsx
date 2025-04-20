'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { FileStack, FileText, Truck, User } from 'lucide-react';

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

	const isActive = pathname === href;
	return (
		<Link
			href={href}
			className={`mb-1 flex items-center gap-3 rounded-md p-3 transition ${
				isActive ? 'bg-gray-200 font-medium text-[#DDAF53]' : 'text-gray-700 hover:bg-gray-100'
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
			<aside className="min-h-screen min-w-64 border-r border-zinc-200 bg-gray-50 p-4">
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
	console.log('here');
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
				{user.role === 'USER' && <UserLinks />}
			</nav>
		</aside>
	);
}

function UserLinks() {
	return (
		<>
			<NavLink href="/initial-declaration" icon={FileStack}>
				Initial Declaration
			</NavLink>

			<NavLink href="/ad-hoc-declaration" icon={Truck}>
				Ad hoc Declaration
			</NavLink>

			<NavLink href="/management-plan" icon={FileText}>
				Management Plan
			</NavLink>
		</>
	);
}

function AdminLinks() {
	return (
		<>
			<NavLink href="/admin/initial-declarations" icon={FileStack}>
				Initial Declaration Builder
			</NavLink>

			<NavLink href="/" icon={Truck}>
				Ad hoc Declaration
			</NavLink>

			<NavLink href="/" icon={FileText}>
				Management Plan
			</NavLink>
		</>
	);
}

function ManagerLinks() {
	return (
		<>
			<NavLink href="/manager/initial-declarations" icon={FileStack}>
				Initial Declarations
			</NavLink>

			<NavLink href="/" icon={Truck}>
				Ad hoc Declarations
			</NavLink>

			<NavLink href="/" icon={FileText}>
				Management Plans
			</NavLink>
		</>
	);
}
