'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { loginUser, LoginRequestDto, LoginResponseDto } from '@/api-client/auth/login';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email').nonempty('Email is required'),
	password: z.string().min(8, 'Password should be at least 8 characters').nonempty('Password is required')
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});
	const router = useRouter();
	const { setUser } = useUser();

	const onSubmit = async (data: LoginSchemaType) => {
		try {
			const payload: LoginRequestDto = data;
			const response: LoginResponseDto = await loginUser(payload);
			console.log('Login successful:', response);
			// if (typeof window !== 'undefined') {
			localStorage.setItem('access_token', response.access_token);
			localStorage.setItem('refresh_token', response.refresh_token);
			// }

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

			router.push(`/`);
		} catch (err) {
			form.setError('password', {
				type: 'manual',
				message: 'Authentication failed. Please try again.'
			});
			console.error(err);
		}
	};

	return (
		<div
			className="flex min-h-screen items-center justify-center bg-cover bg-center"
			style={{ backgroundImage: "url('/images/backgroundNU.png')" }}
		>
			<div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

			<div className="z-10 w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
				<div className="flex flex-col md:flex-row">
					<div className="flex items-center justify-center p-8 md:w-1/2">
						<Image
							src="/images/login.svg"
							alt="Login illustration"
							width={400}
							height={400}
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

						<h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

						{form.formState.errors.password && (
							<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
								{form.formState.errors.password.message}
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

								<Button
									type="submit"
									className="w-full bg-amber-500 hover:bg-amber-600"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? 'Logging in...' : 'Login'}
								</Button>

								{/* <div className="mt-4 text-center text-sm text-gray-500">
									<a href="#" className="hover:underline">
										Forgot your password?
									</a>
								</div> */}
								<div className="mt-4 text-center text-sm text-gray-500">
									<Link href="/register" className="hover:underline">
										Register
									</Link>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
