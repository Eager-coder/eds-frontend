'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { registerUser, RegisterRequestDto, RegisterResponseDto } from '@/api-client/auth/register';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

const registerSchema = z
	.object({
		email: z.string().email('Please enter a valid email').nonempty('Email is required'),
		password: z.string().min(8, 'Password should be at least 8 characters').nonempty('Password is required'),
		confirmPassword: z.string().min(8, 'Password should be at least 8 characters').nonempty('Password is required'),
		firstname: z.string().nonempty('First name is required'),
		lastname: z.string().nonempty('Last name is required'),
		middlename: z.string().optional(),
		position: z.string().nonempty('Position is required'),
		department: z.string().nonempty('Department is required')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match'
	});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function Register() {
	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			firstname: '',
			lastname: '',
			middlename: '',
			position: '',
			department: ''
		}
	});
	const router = useRouter();
	const { setUser } = useUser();

	const onSubmit = async (data: RegisterSchemaType) => {
		try {
			const payload: RegisterRequestDto = { ...data, role: 'USER' };
			const response: RegisterResponseDto = await registerUser(payload);
			console.log('Registration successful:', response);
			if (typeof window !== 'undefined') {
				localStorage.setItem('access_token', response.access_token);
				localStorage.setItem('refresh_token', response.refresh_token);
			}

			// Update user context with the user data from response
			setUser({
				department: response.user.department,
				email: response.user.email,
				firstname: response.user.firstname,
				id: response.user.id,
				lastname: response.user.lastname,
				middlename: response.user.middlename,
				position: response.user.position,
				role: response.user.role,
				isActive: false,
				isDeleted: false,
				registrationDate: response.user.registrationDate
			});

			router.push('/');
		} catch (err) {
			form.setError('confirmPassword', {
				type: 'manual',
				message: 'Registration failed. Please try again.'
			});
			console.error(err);
		}
	};

	return (
		<div
			className="relative flex h-full min-h-screen items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: "url('/images/backgroundNU.webp')" }}
		>
			<div className="absolute inset-0 h-full min-h-screen bg-black/30 backdrop-blur-xs"></div>

			<div className="z-10 w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
				<div className="flex flex-col md:flex-row">
					<div className="flex items-center justify-center p-8 md:w-1/2">
						<Image
							src="/images/login.svg"
							alt="Register illustration"
							width={300}
							height={300}
							className="h-auto max-w-full"
						/>
					</div>

					<div className="flex flex-col p-8 md:w-1/2">
						<div className="mb-8 flex justify-center">
							<Image
								src="/images/logoNU.png"
								alt="Nazarbayev University"
								width={260}
								height={80}
								className="h-16 w-auto"
							/>
						</div>

						<h1 className="mb-6 text-center text-2xl font-bold">Register</h1>
						<Link href={'/login'} className="block text-center hover:text-orange-500">
							Sign in
						</Link>
						{form.formState.errors.confirmPassword && (
							<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
								{form.formState.errors.confirmPassword.message}
							</div>
						)}

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit, (err: unknown) => {
									console.error(err);
								})}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="firstname"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="firstname">First Name</FormLabel>
											<FormControl>
												<Input id="firstname" {...field} placeholder="John" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="middlename"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="middlename">Middle Name</FormLabel>
											<FormControl>
												<Input id="middlename" {...field} placeholder="William" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="lastname"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="lastname">Last Name</FormLabel>
											<FormControl>
												<Input id="lastname" {...field} placeholder="Doe" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="position"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="position">Position</FormLabel>
											<FormControl>
												<Input id="position" {...field} placeholder="Manager" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="department">Department</FormLabel>
											<FormControl>
												<Input id="department" {...field} placeholder="SEDS" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="email">Email address</FormLabel>
											<FormControl>
												<Input
													id="email"
													type="email"
													{...field}
													placeholder="your.email@nu.edu.kz"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="password">Password</FormLabel>
											<FormControl>
												<Input id="password" type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
											<FormControl>
												<Input id="confirmPassword" type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="mt-6 w-full bg-amber-500 hover:bg-amber-600"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? 'Registering...' : 'Register'}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
