'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, User, Truck, FileText, Plus, MoreHorizontal, Bell, CircleUserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { jwtDecode } from 'jwt-decode';
import {
	Form,
	FormControl,
	//   FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { DeclarationResponse, fetchUserDeclaration } from '@/api-client/getUserDeclaration';

// Define the Zod schema for form validation
const relativeSchema = z.object({
	fullName: z.string().min(1, { message: 'Full name is required' }),
	relationDegree: z.string().min(1, { message: 'Relation degree is required' }),
	organization: z.string().min(1, { message: 'Organization is required' }),
	position: z.string().min(1, { message: 'Position is required' }),
	department: z.string().min(1, { message: 'Department is required' })
});

const affiliatedPersonSchema = z.object({
	fullName: z.string().min(1, { message: 'Full name is required' }),
	relationDegree: z.string().min(1, { message: 'Relation degree is required' }),
	organization: z.string().min(1, { message: 'Organization is required' }),
	position: z.string().min(1, { message: 'Position is required' }),
	department: z.string().min(1, { message: 'Department is required' })
});

const workEngagementSchema = z.object({
	organizationType: z.string().min(1, { message: 'Organization type is required' }),
	organizationName: z.string().min(1, { message: 'Organization name is required' }),
	registrationNumber: z.string().min(1, { message: 'Registration number is required' }),
	position: z.string().min(1, { message: 'Position is required' }),
	subdivision: z.string().min(1, { message: 'Subdivision is required' }),
	comments: z.string().optional()
});

const studentAffiliateSchema = z.object({
	fullName: z.string().min(1, { message: 'Full name is required' }),
	relationDegree: z.string().min(1, { message: 'Relation degree is required' }),
	affiliation: z.string().min(1, { message: 'Affiliation is required' }),
	department: z.string().min(1, { message: 'Department is required' }),
	comments: z.string().optional()
});

const formSchema = z.object({
	question1: z.enum(['confirm', 'do-not-confirm']),
	question1Details: z.array(relativeSchema).optional(),
	question2: z.enum(['confirm', 'do-not-confirm']),
	question3: z.enum(['confirm', 'do-not-confirm']),
	question4: z.enum(['yes', 'no']),
	question4Details: z.array(affiliatedPersonSchema).optional(),
	question5: z.enum(['yes', 'no']),
	question5Details: z.array(workEngagementSchema).optional(),
	question6: z.enum(['yes', 'no']),
	question6Details: z.array(studentAffiliateSchema).optional(),
	question7: z.enum(['yes', 'no']),
	question8: z.enum(['yes', 'no']),
	question9: z.enum(['yes', 'no']),
	question10: z.enum(['yes', 'no']),
	certify: z.boolean().refine((val) => val === true, {
		message: 'You must certify that you have read the Policy and Procedure on Conflicts of Interest'
	}),
	confirm: z.boolean().refine((val) => val === true, {
		message: 'You must confirm that you completed and signed this Declaration yourself'
	}),
	affirm: z.boolean().refine((val) => val === true, {
		message: 'You must affirm that your answers are true and accurate'
	})
});

type FormValues = z.infer<typeof formSchema>;

interface DeclarationDetails {
	id: string;
	createdBy: string;
	createdOn: string;
	position: string;
	department: string;
	status: string;
}

export default function DeclarationPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [declaration, setDeclaration] = useState<DeclarationDetails | null>(null);

	// State for managing multiple entities
	const [relatives, setRelatives] = useState<Array<z.infer<typeof relativeSchema>>>([]);
	const [affiliatedPersons, setAffiliatedPersons] = useState<Array<z.infer<typeof affiliatedPersonSchema>>>([]);
	const [workEngagements, setWorkEngagements] = useState<Array<z.infer<typeof workEngagementSchema>>>([]);
	const [studentAffiliates, setStudentAffiliates] = useState<Array<z.infer<typeof studentAffiliateSchema>>>([]);

	const [declarationPresent, setDeclarationPresent] = useState(false);
	const [user, setUser] = useState<null | {
		email: string;
		role: 'USER';
	}>(() => {
		const token = localStorage.getItem('access_token');
		if (!token) return null;

		const { sub, role }: { sub: string; role: 'USER' } = jwtDecode(token);
		return { email: sub, role };
	});
	// Initialize the form with react-hook-form and zod validation
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			question1: 'confirm',
			question2: 'confirm',
			question3: 'confirm',
			question4: 'no',
			question5: 'no',
			question6: 'no',
			question7: 'no',
			question8: 'no',
			question9: 'no',
			question10: 'no',
			certify: false,
			confirm: false,
			affirm: false
		}
	});

	// Watch form values to conditionally render fields
	const question1Value = form.watch('question1');
	const question4Value = form.watch('question4');
	const question5Value = form.watch('question5');
	const question6Value = form.watch('question6');
	// Example: if you need to prefill the form with fetched data, map the fields accordingly.
	// In this dummy example, we assume the API response has fields c1 to c10 that correspond to questions.
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Retrieve token from localStorage
				const token = localStorage.getItem('access_token');
				if (token) {
					const data: DeclarationResponse = await fetchUserDeclaration(token);
					// For demonstration, map some fetched values to our declaration details.
					setDeclaration({
						id: data.id.toString(),
						createdBy: 'Fetched User', // Replace with actual data if available
						createdOn: new Date().toLocaleString(),
						position: data.c2, // example mapping – adjust as needed
						department: data.c3, // example mapping
						status: 'Created' // or derive from data
					});

					// Optionally reset form defaults based on fetched data:
					form.reset({
						// Example: map fetched c1 to question1 (you might need to adjust conversion)
						question1: data.c1 && Object.keys(data.c1).length > 0 ? 'confirm' : 'do-not-confirm',
						question2: data.c2 === 'NO' ? 'do-not-confirm' : 'confirm',
						question3: data.c3 === 'YES' ? 'confirm' : 'do-not-confirm',
						question4: data.c4 === 'YES' ? 'yes' : 'no',
						question5: data.c5 === 'NO' ? 'no' : 'yes',
						question6: data.c6 === 'YES' ? 'yes' : 'no',
						question7: data.c7 === 'NO' ? 'no' : 'yes',
						question8: data.c8 === 'YES' ? 'yes' : 'no',
						question9: data.c9 === 'YES' ? 'yes' : 'no',
						question10: data.c10 === 'NO' ? 'no' : 'yes',
						certify: false,
						confirm: false,
						affirm: false
					});
				}
			} catch (error: any) {
				console.error('Error fetching declaration', error);

				if (error?.message.includes('404')) {
					setDeclarationPresent(false);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [form]);
	// Function to add a new relative
	const addRelative = () => {
		// Get values from input fields
		const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value || '';
		const relationDegree = (document.getElementById('relationDegree') as HTMLInputElement)?.value || '';
		const organization = (document.getElementById('organization') as HTMLInputElement)?.value || '';
		const position = (document.getElementById('position') as HTMLInputElement)?.value || '';
		const department = (document.getElementById('department') as HTMLInputElement)?.value || '';

		// Validate fields
		const errors: string[] = [];
		if (!fullName) errors.push('Full name is required');
		if (!relationDegree) errors.push('Relation degree is required');
		if (!organization) errors.push('Organization is required');
		if (!position) errors.push('Position is required');
		if (!department) errors.push('Department is required');

		// If there are errors, show them and return
		if (errors.length > 0) {
			alert(`Please fix the following errors:\n${errors.join('\n')}`);
			return;
		}

		// Create new relative object
		const newRelative = {
			fullName,
			relationDegree,
			organization,
			position,
			department
		};

		// Update state with new relative
		const updatedRelatives = [...relatives, newRelative];
		setRelatives(updatedRelatives);

		// Update form values
		form.setValue('question1Details', updatedRelatives);

		// Clear input fields
		const inputIds = ['fullName', 'relationDegree', 'organization', 'position', 'department'];
		inputIds.forEach((id) => {
			const input = document.getElementById(id) as HTMLInputElement;
			if (input) input.value = '';
		});
	};

	// Function to add a new affiliated person
	const addAffiliatedPerson = () => {
		// Get values from input fields
		const fullName = (document.getElementById('affiliatedFullName') as HTMLInputElement)?.value || '';
		const relationDegree = (document.getElementById('affiliatedRelationDegree') as HTMLInputElement)?.value || '';
		const organization = (document.getElementById('affiliatedOrganization') as HTMLInputElement)?.value || '';
		const position = (document.getElementById('affiliatedPosition') as HTMLInputElement)?.value || '';
		const department = (document.getElementById('affiliatedDepartment') as HTMLInputElement)?.value || '';

		// Validate fields
		const errors: string[] = [];
		if (!fullName) errors.push('Full name is required');
		if (!relationDegree) errors.push('Relation degree is required');
		if (!organization) errors.push('Organization is required');
		if (!position) errors.push('Position is required');
		if (!department) errors.push('Department is required');

		// If there are errors, show them and return
		if (errors.length > 0) {
			alert(`Please fix the following errors:\n${errors.join('\n')}`);
			return;
		}

		// Create new person object
		const newPerson = {
			fullName,
			relationDegree,
			organization,
			position,
			department
		};

		// Update state with new person
		const updatedPersons = [...affiliatedPersons, newPerson];
		setAffiliatedPersons(updatedPersons);

		// Update form values
		form.setValue('question4Details', updatedPersons);

		// Clear input fields
		const inputIds = [
			'affiliatedFullName',
			'affiliatedRelationDegree',
			'affiliatedOrganization',
			'affiliatedPosition',
			'affiliatedDepartment'
		];
		inputIds.forEach((id) => {
			const input = document.getElementById(id) as HTMLInputElement;
			if (input) input.value = '';
		});
	};

	// Function to add a new work engagement
	const addWorkEngagement = () => {
		// Get values from input fields
		const organizationType = (document.getElementById('organizationType') as HTMLInputElement)?.value || '';
		const organizationName = (document.getElementById('organizationName') as HTMLInputElement)?.value || '';
		const registrationNumber = (document.getElementById('registrationNumber') as HTMLInputElement)?.value || '';
		const position = (document.getElementById('workPosition') as HTMLInputElement)?.value || '';
		const subdivision = (document.getElementById('subdivision') as HTMLInputElement)?.value || '';
		const comments = (document.getElementById('comments') as HTMLInputElement)?.value || '';

		// Validate fields
		const errors: string[] = [];
		if (!organizationType) errors.push('Organization type is required');
		if (!organizationName) errors.push('Organization name is required');
		if (!registrationNumber) errors.push('Registration number is required');
		if (!position) errors.push('Position is required');
		if (!subdivision) errors.push('Subdivision is required');

		// If there are errors, show them and return
		if (errors.length > 0) {
			alert(`Please fix the following errors:\n${errors.join('\n')}`);
			return;
		}

		// Create new engagement object
		const newEngagement = {
			organizationType,
			organizationName,
			registrationNumber,
			position,
			subdivision,
			comments
		};

		// Update state with new engagement
		const updatedEngagements = [...workEngagements, newEngagement];
		setWorkEngagements(updatedEngagements);

		// Update form values
		form.setValue('question5Details', updatedEngagements);

		// Clear input fields
		const inputIds = [
			'organizationType',
			'organizationName',
			'registrationNumber',
			'workPosition',
			'subdivision',
			'comments'
		];
		inputIds.forEach((id) => {
			const input = document.getElementById(id) as HTMLInputElement;
			if (input) input.value = '';
		});
	};

	// Function to add a new student affiliate
	const addStudentAffiliate = () => {
		// Get values from input fields
		const fullName = (document.getElementById('studentFullName') as HTMLInputElement)?.value || '';
		const relationDegree = (document.getElementById('studentRelationDegree') as HTMLInputElement)?.value || '';
		const affiliation = (document.getElementById('studentAffiliation') as HTMLInputElement)?.value || '';
		const department = (document.getElementById('studentDepartment') as HTMLInputElement)?.value || '';
		const comments = (document.getElementById('studentComments') as HTMLInputElement)?.value || '';

		// Validate fields
		const errors: string[] = [];
		if (!fullName) errors.push('Full name is required');
		if (!relationDegree) errors.push('Relation degree is required');
		if (!affiliation) errors.push('Affiliation is required');
		if (!department) errors.push('Department is required');

		// If there are errors, show them and return
		if (errors.length > 0) {
			alert(`Please fix the following errors:\n${errors.join('\n')}`);
			return;
		}

		// Create new student object
		const newStudent = {
			fullName,
			relationDegree,
			affiliation,
			department,
			comments
		};

		// Update state with new student
		const updatedStudents = [...studentAffiliates, newStudent];
		setStudentAffiliates(updatedStudents);

		// Update form values
		form.setValue('question6Details', updatedStudents);

		// Clear input fields
		const inputIds = [
			'studentFullName',
			'studentRelationDegree',
			'studentAffiliation',
			'studentDepartment',
			'studentComments'
		];
		inputIds.forEach((id) => {
			const input = document.getElementById(id) as HTMLInputElement;
			if (input) input.value = '';
		});
	};

	// Function to handle form submission
	const onSubmit = (data: FormValues) => {
		console.log('Form submitted:', data);
		// Here you would typically send the data to your backend
		alert('Declaration submitted successfully!');
	};

	useEffect(() => {
		// Simulate API call to fetch declaration details
		const fetchDeclaration = async () => {
			// In a real app, this would be an API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			setDeclaration({
				id: 'DEC-#####',
				createdBy: '-',
				createdOn: '-',
				position: '-',
				department: '-',
				status: '-'
			});
			setIsLoading(false);
		};

		fetchDeclaration();
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* Header */}
			<header className="border-b px-6 py-3 flex items-center justify-between">
				<div className="flex items-center">
					<Image
						src="/images/logoNU.png"
						alt="Nazarbayev University"
						width={260}
						height={50}
						className="h-12 w-auto"
					/>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							2
						</div>
						<Button variant="ghost" size="icon" className="text-gray-600">
							<Bell className="h-5 w-5" />
						</Button>
					</div>
					<Button variant="ghost" size="icon" className="text-gray-600">
						<Settings className="h-5 w-5" />
					</Button>
					<CircleUserRound className="object-cover w-8 h-8" />
				</div>
			</header>

			<div className="flex flex-1">
				{/* Sidebar */}
				<aside className="w-64 border-r bg-gray-50">
					<div className="p-4 border-b">
						<h2 className="font-bold text-lg">Your Profile</h2>
						<p className="text-sm text-gray-500">{user ? user.email : ''}</p>
					</div>
					<nav className="p-2">
						<div className="bg-amber-100 rounded-md p-3 mb-1 flex items-center gap-3 font-medium">
							<User className="h-5 w-5" />
							<span>My Initial Declaration</span>
						</div>

						{/* <div className="hover:bg-gray-100 rounded-md p-3 mb-1 flex items-center gap-3">
              <Truck className="h-5 w-5" />
              <span>Ad hoc Declaration</span>
            </div> */}
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-6 overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<Link href="/" className="text-gray-500 hover:text-gray-700">
								<ArrowLeft className="h-6 w-6" />
							</Link>
							<h1 className="text-2xl font-bold">{declaration?.id}</h1>
						</div>
						<div className="flex gap-3">
							<Button className="bg-amber-500 hover:bg-amber-600" onClick={form.handleSubmit(onSubmit)}>
								Submit Declaration
							</Button>
							<Button variant="outline">Save as Draft</Button>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Progress Tracker */}
					<div className="mb-8">
						<div className="relative flex items-center justify-between">
							<div className="h-0.5 absolute left-0 right-0 bg-gray-200">
								<div className="h-full w-1/6 bg-gray-600"></div>
							</div>
							<div className="relative flex flex-col items-center">
								<div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm z-10">
									1
								</div>
								<span className="text-sm mt-2 font-medium">Created</span>
							</div>
							<div className="relative flex flex-col items-center">
								<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm z-10">
									2
								</div>
								<span className="text-sm mt-2">Sent for Approval</span>
							</div>
							<div className="relative flex flex-col items-center">
								<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm z-10">
									3
								</div>
								<span className="text-sm mt-2">Reviewed - conflict identified</span>
							</div>
						</div>
					</div>

					{/* Declaration Details */}
					<div className="bg-white rounded-lg border p-6 mb-6">
						<div className="grid grid-cols-2 gap-6">
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Number</h3>
								<p>{declaration?.id}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Created by</h3>
								<p className="text-blue-600">{declaration?.createdBy}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Created on</h3>
								<p>{declaration?.createdOn}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Position/Manager</h3>
								<p>{declaration?.position}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Department/Office/School</h3>
								<p>{declaration?.department}</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-500 mb-1">Status</h3>
								<p>{declaration?.status}</p>
							</div>
						</div>
					</div>

					{/* Declaration Form */}
					{true ? (
						<div className="bg-white rounded-lg border p-6 space-y-8">
							<h2 className="text-lg font-semibold mb-6">Initial Declaration</h2>

							<Form {...form}>
								<form className="space-y-8">
									{/* Question 1 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											1. I declare that I have no close relatives employed by the autonomous
											organization of education Nazarbayev University and/or its organizations
											management bodies.
										</p>
										<FormField
											control={form.control}
											name="question1"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="confirm" id="confirm-1" />
																<Label htmlFor="confirm-1">Confirm</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="do-not-confirm"
																	id="do-not-confirm-1"
																/>
																<Label htmlFor="do-not-confirm-1">Do not confirm</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{question1Value === 'do-not-confirm' && (
											<div className="mt-4 border rounded-md p-4 bg-gray-50">
												<h3 className="font-medium mb-3">
													Please provide details about your relatives:
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="fullName">Full Name</Label>
														<Input id="fullName" placeholder="Enter full name" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="relationDegree">Relation degree</Label>
														<Input
															id="relationDegree"
															placeholder="E.g., Spouse, Sibling"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="organization">Organization</Label>
														<Input id="organization" placeholder="Enter organization" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="position">Position/status</Label>
														<Input id="position" placeholder="Enter position" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="department">Department/Office/School</Label>
														<Input id="department" placeholder="Enter department" />
													</div>
												</div>
												{/* Display added relatives */}
												{relatives.length > 0 && (
													<div className="mt-4">
														<h4 className="font-medium mb-2">Added Relatives:</h4>
														<div className="space-y-3">
															{relatives.map((relative, index) => (
																<div
																	key={index}
																	className="p-3 bg-white border rounded-md"
																>
																	<p>
																		<span className="font-medium">Name:</span>{' '}
																		{relative.fullName}
																	</p>
																	<p>
																		<span className="font-medium">Relation:</span>{' '}
																		{relative.relationDegree}
																	</p>
																	<p>
																		<span className="font-medium">
																			Organization:
																		</span>{' '}
																		{relative.organization}
																	</p>
																	<p>
																		<span className="font-medium">Position:</span>{' '}
																		{relative.position}
																	</p>
																	<p>
																		<span className="font-medium">Department:</span>{' '}
																		{relative.department}
																	</p>
																</div>
															))}
														</div>
													</div>
												)}

												<Button
													type="button"
													variant="outline"
													className="mt-4"
													onClick={addRelative}
												>
													<Plus className="h-4 w-4 mr-2" /> Add Another Relative
												</Button>
											</div>
										)}
									</div>

									{/* Question 2 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											2. I declare that I have no commercial or financial/non-financial interests
											in entities that seek to, or already have entered into transactions with
											Nazarbayev University and/or its organizations.
										</p>
										<FormField
											control={form.control}
											name="question2"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="confirm" id="confirm-2" />
																<Label htmlFor="confirm-2">Confirm</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="do-not-confirm"
																	id="do-not-confirm-2"
																/>
																<Label htmlFor="do-not-confirm-2">Do not confirm</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Question 3 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											3. I declare that I have no equity or other financial/non-financial interest
											in a company or organization that acts as a party in litigation or
											arbitration against Nazarbayev University and/or its organizations.
										</p>
										<FormField
											control={form.control}
											name="question3"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="confirm" id="confirm-3" />
																<Label htmlFor="confirm-3">Confirm</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem
																	value="do-not-confirm"
																	id="do-not-confirm-3"
																/>
																<Label htmlFor="do-not-confirm-3">Do not confirm</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Question 4 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											4. Do any of your affiliated persons (excluding close relatives) work at
											Nazarbayev University and/or its organizations?
										</p>
										<FormField
											control={form.control}
											name="question4"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-4" />
																<Label htmlFor="yes-4">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-4" />
																<Label htmlFor="no-4">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{question4Value === 'yes' && (
											<div className="mt-4 border rounded-md p-4 bg-gray-50">
												<h3 className="font-medium mb-3">
													Please provide details about affiliated persons:
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="affiliatedFullName">Full Name</Label>
														<Input id="affiliatedFullName" placeholder="Enter full name" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="affiliatedRelationDegree">
															Relation degree
														</Label>
														<Input
															id="affiliatedRelationDegree"
															placeholder="E.g., Friend, Colleague"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="affiliatedOrganization">Organization</Label>
														<Input
															id="affiliatedOrganization"
															placeholder="Enter organization"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="affiliatedPosition">Position/status</Label>
														<Input id="affiliatedPosition" placeholder="Enter position" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="affiliatedDepartment">
															Department/Office/School
														</Label>
														<Input
															id="affiliatedDepartment"
															placeholder="Enter department"
														/>
													</div>
												</div>
												{/* Display added affiliated persons */}
												{affiliatedPersons.length > 0 && (
													<div className="mt-4">
														<h4 className="font-medium mb-2">Added Affiliated Persons:</h4>
														<div className="space-y-3">
															{affiliatedPersons.map((person, index) => (
																<div
																	key={index}
																	className="p-3 bg-white border rounded-md"
																>
																	<p>
																		<span className="font-medium">Name:</span>{' '}
																		{person.fullName}
																	</p>
																	<p>
																		<span className="font-medium">Relation:</span>{' '}
																		{person.relationDegree}
																	</p>
																	<p>
																		<span className="font-medium">
																			Organization:
																		</span>{' '}
																		{person.organization}
																	</p>
																	<p>
																		<span className="font-medium">Position:</span>{' '}
																		{person.position}
																	</p>
																	<p>
																		<span className="font-medium">Department:</span>{' '}
																		{person.department}
																	</p>
																</div>
															))}
														</div>
													</div>
												)}

												<Button
													type="button"
													variant="outline"
													className="mt-4"
													onClick={addAffiliatedPerson}
												>
													<Plus className="h-4 w-4 mr-2" /> Add Another Person
												</Button>
											</div>
										)}
									</div>

									{/* Question 5 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											5. Have you engaged in any work, paid or unpaid, other than for Nazarbayev
											University and/or its organizations or planning to in the next 12 months?
										</p>
										<FormField
											control={form.control}
											name="question5"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-5" />
																<Label htmlFor="yes-5">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-5" />
																<Label htmlFor="no-5">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{question5Value === 'yes' && (
											<div className="mt-4 border rounded-md p-4 bg-gray-50">
												<h3 className="font-medium mb-3">
													Please provide details about your work engagement:
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="organizationType">Organization type</Label>
														<Input
															id="organizationType"
															placeholder="Enter organization type"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="organizationName">Organization name</Label>
														<Input
															id="organizationName"
															placeholder="Enter organization name"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="registrationNumber">
															BIN/IIN or registration number
														</Label>
														<Input
															id="registrationNumber"
															placeholder="Enter registration number"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="workPosition">Position/status</Label>
														<Input id="workPosition" placeholder="Enter position" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="subdivision">Subdivision</Label>
														<Input id="subdivision" placeholder="Enter subdivision" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="comments">Comments (optional)</Label>
														<Input id="comments" placeholder="Enter comments" />
													</div>
												</div>
												{/* Display added work engagements */}
												{workEngagements.length > 0 && (
													<div className="mt-4">
														<h4 className="font-medium mb-2">Added Work Engagements:</h4>
														<div className="space-y-3">
															{workEngagements.map((engagement, index) => (
																<div
																	key={index}
																	className="p-3 bg-white border rounded-md"
																>
																	<p>
																		<span className="font-medium">
																			Organization Type:
																		</span>{' '}
																		{engagement.organizationType}
																	</p>
																	<p>
																		<span className="font-medium">
																			Organization Name:
																		</span>{' '}
																		{engagement.organizationName}
																	</p>
																	<p>
																		<span className="font-medium">
																			Registration Number:
																		</span>{' '}
																		{engagement.registrationNumber}
																	</p>
																	<p>
																		<span className="font-medium">Position:</span>{' '}
																		{engagement.position}
																	</p>
																	<p>
																		<span className="font-medium">
																			Subdivision:
																		</span>{' '}
																		{engagement.subdivision}
																	</p>
																	{engagement.comments && (
																		<p>
																			<span className="font-medium">
																				Comments:
																			</span>{' '}
																			{engagement.comments}
																		</p>
																	)}
																</div>
															))}
														</div>
													</div>
												)}

												<Button
													type="button"
													variant="outline"
													className="mt-4"
													onClick={addWorkEngagement}
												>
													<Plus className="h-4 w-4 mr-2" /> Add Another Work Engagement
												</Button>
											</div>
										)}
									</div>

									{/* Question 6 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											6. Are any of your affiliated persons (including close relatives) currently
											students at Nazarbayev University?
										</p>
										<FormField
											control={form.control}
											name="question6"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-6" />
																<Label htmlFor="yes-6">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-6" />
																<Label htmlFor="no-6">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{question6Value === 'yes' && (
											<div className="mt-4 border rounded-md p-4 bg-gray-50">
												<h3 className="font-medium mb-3">
													Please provide details about affiliated students:
												</h3>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="studentFullName">Full Name</Label>
														<Input id="studentFullName" placeholder="Enter full name" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="studentRelationDegree">Relation degree</Label>
														<Input
															id="studentRelationDegree"
															placeholder="E.g., Child, Sibling"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="studentAffiliation">Affiliation</Label>
														<Input
															id="studentAffiliation"
															placeholder="Enter affiliation"
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="studentDepartment">
															Department/Office/School
														</Label>
														<Input id="studentDepartment" placeholder="Enter department" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="studentComments">Comments (optional)</Label>
														<Input id="studentComments" placeholder="Enter comments" />
													</div>
												</div>
												{/* Display added student affiliates */}
												{studentAffiliates.length > 0 && (
													<div className="mt-4">
														<h4 className="font-medium mb-2">Added Student Affiliates:</h4>
														<div className="space-y-3">
															{studentAffiliates.map((student, index) => (
																<div
																	key={index}
																	className="p-3 bg-white border rounded-md"
																>
																	<p>
																		<span className="font-medium">Name:</span>{' '}
																		{student.fullName}
																	</p>
																	<p>
																		<span className="font-medium">Relation:</span>{' '}
																		{student.relationDegree}
																	</p>
																	<p>
																		<span className="font-medium">
																			Affiliation:
																		</span>{' '}
																		{student.affiliation}
																	</p>
																	<p>
																		<span className="font-medium">Department:</span>{' '}
																		{student.department}
																	</p>
																	{student.comments && (
																		<p>
																			<span className="font-medium">
																				Comments:
																			</span>{' '}
																			{student.comments}
																		</p>
																	)}
																</div>
															))}
														</div>
													</div>
												)}

												<Button
													type="button"
													variant="outline"
													className="mt-4"
													onClick={addStudentAffiliate}
												>
													<Plus className="h-4 w-4 mr-2" /> Add Another Student
												</Button>
											</div>
										)}
									</div>

									{/* Question 7 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											7. Are you or any affiliated person a member of any committee, counsels at
											Nazarbayev University and/or its organizations&apos; management bodies?
										</p>
										<FormField
											control={form.control}
											name="question7"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-7" />
																<Label htmlFor="yes-7">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-7" />
																<Label htmlFor="no-7">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Question 8 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											8. Do you or any affiliated person have a financial interest in a company or
											organization (foreign or domestic) that does business with (contracts,
											sponsors, funds, provides goods or services to) Nazarbayev University and/or
											its organizations?
										</p>
										<FormField
											control={form.control}
											name="question8"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-8" />
																<Label htmlFor="yes-8">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-8" />
																<Label htmlFor="no-8">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Question 9 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											9. Do you engage in research that is financed by any source that could
											potentially result in a conflict of interest?
										</p>
										<FormField
											control={form.control}
											name="question9"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-9" />
																<Label htmlFor="yes-9">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-9" />
																<Label htmlFor="no-9">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Question 10 */}
									<div className="space-y-4">
										<p className="text-gray-700">
											10. Are there any other transactions or relationships that are not addressed
											elsewhere in this questionnaire, involving you or any affiliated person that
											could affect your ability to exercise independent judgment in making
											decisions?
										</p>
										<FormField
											control={form.control}
											name="question10"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormControl>
														<RadioGroup
															onValueChange={field.onChange}
															defaultValue={field.value}
															className="flex gap-6"
														>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="yes" id="yes-10" />
																<Label htmlFor="yes-10">Yes</Label>
															</div>
															<div className="flex items-center space-x-2">
																<RadioGroupItem value="no" id="no-10" />
																<Label htmlFor="no-10">No</Label>
															</div>
														</RadioGroup>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Certification Statements */}
									<div className="space-y-4 border-t pt-6">
										<h3 className="font-medium">Certification</h3>

										<FormField
											control={form.control}
											name="certify"
											render={({ field }) => (
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>
															I certify that I have read the Policy and Procedure on
															Conflicts of Interest and that the above information is
															correct.
														</FormLabel>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="confirm"
											render={({ field }) => (
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>
															I confirm that I completed and signed this Declaration
															myself on my.nu.edu.kz portal using a unique login and
															password assigned.
														</FormLabel>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="affirm"
											render={({ field }) => (
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<div className="space-y-1 leading-none">
														<FormLabel>
															I affirm that my answers are true and accurate to the best
															of my knowledge. I will promptly and properly advise
															Nazarbayev University of any changes to the information
															provided in this declaration.
														</FormLabel>
														<FormMessage />
													</div>
												</FormItem>
											)}
										/>

										<p className="text-sm text-red-600 mt-4">
											I further understand that any false statement may result in disciplinary
											action.
										</p>
									</div>

									<div className="flex justify-end pt-6">
										<Button type="button" variant="outline" className="mr-2">
											Cancel
										</Button>
										<Button
											type="submit"
											className="bg-amber-500 hover:bg-amber-600"
											onClick={form.handleSubmit(onSubmit)}
										>
											Submit Declaration
										</Button>
									</div>
								</form>
							</Form>
						</div>
					) : null}
				</main>
			</div>
		</div>
	);
}
