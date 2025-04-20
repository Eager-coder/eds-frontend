// src/components/skeletons/ViewDeclarationSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function ViewDeclarationSkeleton() {
	return (
		<div className="w-full space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-1/4" /> {/* Back button area */}
				<Skeleton className="h-8 w-1/2" /> {/* Title */}
			</div>
			<Skeleton className="h-6 w-1/3" /> {/* Submitter Info */}
			{/* Question Skeletons */}
			<div className="space-y-6">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="space-y-3 rounded-md border p-4">
						<Skeleton className="h-6 w-3/4" /> {/* Question Label */}
						<Skeleton className="h-5 w-1/2" /> {/* Note/Description */}
						<div className="space-y-2 pl-4">
							<Skeleton className="h-8 w-full rounded" /> {/* Answer Area */}
							{/* Optional: Skeleton for additional answers */}
							{i % 2 === 0 && (
								<div className="mt-4 space-y-3 rounded-md border border-gray-300 bg-gray-100 p-4">
									<Skeleton className="h-5 w-1/3" />
									<Skeleton className="h-8 w-full rounded" />
									<Skeleton className="h-8 w-full rounded" />
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
