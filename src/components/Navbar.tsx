'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Bell, CircleUserRound, Settings } from 'lucide-react';

export function Navbar() {
	return (
		<header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
			<div className="flex items-center">
			<Link href="/">
				<Image
					src="/images/logoNU.png"
					alt="Nazarbayev University"
					width={260}
					priority
					height={50}
					// className="h-12 w-auto cursor-pointer"
					className="h-12 w-auto cursor-pointer"
				/>
			</Link>	
			</div>
			<div className="flex items-center gap-4">
				<div className="relative">
					<div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
						2
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="text-gray-600"
						// onClick={() => setNotificationsSidebarOpen(true)}
					>
						{/* <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Notifications"
                width={24}
                height={24}
              /> */}
						<Bell className="h-5 w-5" />
					</Button>
				</div>
				{/* <Button variant="ghost" size="icon" className="text-gray-600">
					<Settings className="h-5 w-5" />
				</Button> */}
				<div className="group relative">
					{/* <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="User profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div> */}
			<Link href="/profile">
			<CircleUserRound size={16} strokeWidth={0.75}  className="h-10 w-10 cursor-pointer object-cover" />
			</Link>
					
					
				</div>
			</div>
		</header>
	);
}
