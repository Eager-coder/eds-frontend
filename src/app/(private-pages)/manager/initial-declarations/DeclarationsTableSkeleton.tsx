// src/components/skeletons/DeclarationsTableSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

export function DeclarationsTableSkeleton() {
	const tableHeaders = ['ID', 'Title', 'Status', 'Created Date', 'Link'];
	const numRows = 5; // Number of skeleton rows to display

	return (
		<div className="w-full space-y-6">
			<Skeleton className="h-8 w-1/3" /> {/* Title Skeleton */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{tableHeaders.map((header) => (
								<TableHead key={header}>
									{/* Add width constraints if desired */}
									{header === 'ID' ? (
										<Skeleton className="h-5 w-16" />
									) : header === 'Status' ? (
										<Skeleton className="h-5 w-24" />
									) : header === 'Created Date' ? (
										<Skeleton className="h-5 w-32" />
									) : header === 'Link' ? (
										<Skeleton className="h-5 w-10" />
									) : (
										<Skeleton className="h-5 w-full" />
									)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(numRows)].map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-5 w-16" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-full" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-20 rounded-full" />
								</TableCell>{' '}
								{/* Mimic Badge */}
								<TableCell>
									<Skeleton className="h-5 w-28" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-5 w-5" />
								</TableCell>{' '}
								{/* Mimic Icon */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
