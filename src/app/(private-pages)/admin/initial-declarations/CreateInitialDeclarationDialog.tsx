import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { createInitialDeclaration, CreateInitialDeclarationRequest } from '@/api-client/admin/createInitialDeclaration';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface Props {
	onSubmit: () => Promise<void>;
}

export function CreateInitialDeclarationDialog({ onSubmit: onFormSubmit }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm<CreateInitialDeclarationRequest>({
		defaultValues: { name: '', isActive: false }
	});

	const onSubmit = async (values: CreateInitialDeclarationRequest) => {
		try {
			const newDecl = await createInitialDeclaration(values);
			await onFormSubmit();
			setIsOpen(false);
			form.reset();
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Plus className="mr-2 h-4 w-4" /> New Declaration
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Initial Declaration</DialogTitle>
					<DialogDescription>Fill in the details to create a new declaration.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Name*" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl className="flex items-center">
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel className="text-base">Active</FormLabel>
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="ghost">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
