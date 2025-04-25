'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, FileText, Shield, Users, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<section className="w-full bg-gradient-to-b from-[#f8f8f8] to-white py-12 md:py-16">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="mb-4 flex items-center gap-2">
								<div className="flex h-12 w-12 items-center justify-center rounded-md text-xl text-white">
									<Image
										src="/images/logo.png"
										alt="Nazarbayev University"
										width={260}
										priority
										height={50}
										// className="h-12 w-auto cursor-pointer"
										className="h-12 w-auto cursor-pointer"
									/>
								</div>
								<div className="h-8 w-px bg-[#5a5a5a]"></div>
								<h2 className="text-xl text-[#5a5a5a]">CONFLICT OF INTEREST PORTAL</h2>
							</div>
							<div className="space-y-2">
								<h1 className="text-3xl tracking-tight text-[#5a5a5a] sm:text-4xl md:text-5xl">
									Policy and Procedure on Conflict of Interest
								</h1>
								<p className="mx-auto max-w-[700px] text-[#5a5a5a] md:text-xl">
									Autonomous Organization of Education Nazarbayev University
								</p>
							</div>
						</div>
					</div>
				</section>
				<section className="container px-4 py-12 md:px-6">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="mb-8 grid w-full grid-cols-3 bg-zinc-300">
							<TabsTrigger value="overview" className="text-black data-[state=active]:bg-white">
								OVERVIEW
							</TabsTrigger>
							<TabsTrigger value="key-points" className="text-black data-[state=active]:bg-white">
								KEY POINTS
							</TabsTrigger>
							<TabsTrigger value="procedure" className="text-black data-[state=active]:bg-white">
								PROCEDURE
							</TabsTrigger>
						</TabsList>
						<TabsContent value="overview" className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<Card className="border-[#d4b06a]/20">
									<CardHeader className="border-b border-[#d4b06a]/20">
										<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
											<BookOpen className="h-5 w-5 text-[#d4b06a]" />
											Purpose and Application
										</CardTitle>
										<CardDescription className="text-[#5a5a5a]/70">
											Section 1 of the Policy
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-6 text-[#5a5a5a]">
										<p>
											The purpose of this Policy is to protect the interests of the Autonomous
											Organization of Education Nazarbayev University and its staff and students
											by establishing an effective system for disclosure. It serves as a guide to
											identifying and managing any actual, potential, or perceived conflicts of
											interest.
										</p>
										<p className="mt-4">
											This Policy applies to all staff, including members of the Managing Council,
											and certain students as defined in the Policy.
										</p>
									</CardContent>
								</Card>
								<Card className="border-[#d4b06a]/20">
									<CardHeader className="border-b border-[#d4b06a]/20">
										<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
											<HelpCircle className="h-5 w-5 text-[#d4b06a]" />
											Key Definitions
										</CardTitle>
										<CardDescription className="text-[#5a5a5a]/70">
											Section 2 of the Policy
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4 pt-6 text-[#5a5a5a]">
										<div>
											<h3 className="font-semibold">Conflict of Interest</h3>
											<p>
												A situation when there is a divergence between private interests of
												individuals and their professional obligations to the University.
											</p>
										</div>
										<div>
											<h3 className="font-semibold">Affiliated Persons</h3>
											<p>
												Individuals, including close relatives of the Disclosing person and of
												their spouse, and legal entities that have the ability to influence
												decisions of the Disclosing person.
											</p>
										</div>
										<div>
											<h3 className="font-semibold">Declaration</h3>
											<p>
												A formal and explicit statement about the presence or absence of a
												conflict of interest.
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
							<Card className="border-[#d4b06a]/20">
								<CardHeader className="border-b border-[#d4b06a]/20">
									<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
										<Shield className="h-5 w-5 text-[#d4b06a]" />
										Governing Principles
									</CardTitle>
									<CardDescription className="text-[#5a5a5a]/70">
										Section 3.1 of the Policy
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-6 text-[#5a5a5a]">
									<div className="grid gap-4 md:grid-cols-2">
										<ul className="list-disc space-y-2 pl-6">
											<li>
												Any actual, potential or perceived conflict of interest is subject to
												mandatory disclosure
											</li>
											<li>
												Each conflict of interest is reviewed individually and monitored closely
											</li>
											<li>
												Balance is maintained between the interests of the University, its staff
												members and students
											</li>
										</ul>
										<ul className="list-disc space-y-2 pl-6">
											<li>Information disclosed is treated as confidential</li>
											<li>All staff members and students must comply with the Policy</li>
											<li>
												An effective mechanism for identification, recognition, and management
												of conflicts is established
											</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="key-points" className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<Card className="border-[#d4b06a]/20">
									<CardHeader className="border-b border-[#d4b06a]/20">
										<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
											<Users className="h-5 w-5 text-[#d4b06a]" />
											Conflicts in Employment Matters
										</CardTitle>
										<CardDescription className="text-[#5a5a5a]/70">
											Section 3.5 of the Policy
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-6 text-[#5a5a5a]">
										<p>
											Staff members must not allow their private interests to conflict with their
											professional duties. They must not use their official position or
											information acquired in the course of their employment for personal gain.
										</p>
										<p className="mt-4">
											Close relatives of staff members shall not be recruited by the University,
											with exceptions for academic and administrative-academic staff members.
										</p>
										<p className="mt-4">
											Staff members must not accept or engage in any remunerated employment,
											consulting, or professional services without prior approval.
										</p>
									</CardContent>
								</Card>
								<Card className="border-[#d4b06a]/20">
									<CardHeader className="border-b border-[#d4b06a]/20">
										<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
											<AlertTriangle className="h-5 w-5 text-[#d4b06a]" />
											Conflicts in Commercial Matters
										</CardTitle>
										<CardDescription className="text-[#5a5a5a]/70">
											Section 3.7 of the Policy
										</CardDescription>
									</CardHeader>
									<CardContent className="pt-6 text-[#5a5a5a]">
										<p>
											University procurement is grounded on the highest standards of ethics and
											professionalism that include fairness, equal opportunity for all bidders,
											and transparency.
										</p>
										<p className="mt-4">
											All staff members involved in the procurement process must disclose any
											conflict of interest before participating in the process.
										</p>
										<p className="mt-4">
											Any commercial interest identified prior, during, or post the procurement
											process must be immediately disclosed.
										</p>
									</CardContent>
								</Card>
							</div>
							<Card className="border-[#d4b06a]/20">
								<CardHeader className="border-b border-[#d4b06a]/20">
									<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
										<FileText className="h-5 w-5 text-[#d4b06a]" />
										Conflicts in Financial Matters
									</CardTitle>
									<CardDescription className="text-[#5a5a5a]/70">
										Section 3.6 of the Policy
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-6 text-[#5a5a5a]">
									<p>
										Staff members must alert to potential, perceived, or actual conflicts of
										interests if they have direct or indirect interests in:
									</p>
									<div className="mt-4 grid gap-4 md:grid-cols-2">
										<ul className="list-disc space-y-2 pl-6">
											<li>Research activities</li>
											<li>Partnerships</li>
											<li>Transactions, transfers of assets, money and/or interests</li>
											<li>Investments</li>
											<li>Discounts, bonuses or other favorable contract terms</li>
										</ul>
										<ul className="list-disc space-y-2 pl-6">
											<li>Debt, the partial or total forgiveness of debt</li>
											<li>
												Payments, compensation arrangements, direct and indirect remuneration
											</li>
											<li>Hospitality and/or gifts</li>
											<li>Equity interests (e.g., stocks, shares or other equity interests)</li>
											<li>Property right, including intellectual property rights</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="procedure" className="space-y-6">
							<Card className="border-[#d4b06a]/20">
								<CardHeader className="border-b border-[#d4b06a]/20">
									<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
										<CheckCircle className="h-5 w-5 text-[#d4b06a]" />
										Conflict of Interest Procedure
									</CardTitle>
									<CardDescription className="text-[#5a5a5a]/70">
										Section 3.3 of the Policy
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-6 text-[#5a5a5a]">
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">1. Identifying Conflicts of Interest</h3>
											<p className="mt-2 text-sm">
												All staff members and students must identify and acknowledge potential
												conflicts of interest.
											</p>
										</div>
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">2. Disclosure of Conflicts of Interest</h3>
											<p className="mt-2 text-sm">
												Staff members and students must declare any conflict of interest by
												submitting the appropriate Declaration Form.
											</p>
										</div>
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">3. Review and Evaluation</h3>
											<p className="mt-2 text-sm">
												Each Declaration is subject to careful review and evaluation by the
												University Unit.
											</p>
										</div>
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">4. Resolution of Conflicts</h3>
											<p className="mt-2 text-sm">
												If a conflict is identified, a management plan is developed in
												consultation with the Disclosing person.
											</p>
										</div>
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">5. Monitoring Conflicts</h3>
											<p className="mt-2 text-sm">
												The University Unit is responsible for monitoring conflicts to ensure
												management plans remain effective.
											</p>
										</div>
										<div className="rounded-lg border border-[#d4b06a]/20 p-4">
											<h3 className="font-semibold">6. Reporting Conflicts</h3>
											<p className="mt-2 text-sm">
												The University Unit prepares annual summary reports on conflicts of
												interest for the President&apos;s review.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card className="border-[#d4b06a]/20">
								<CardHeader className="border-b border-[#d4b06a]/20">
									<CardTitle className="flex items-center gap-2 text-[#5a5a5a]">
										<AlertTriangle className="h-5 w-5 text-[#d4b06a]" />
										Liability
									</CardTitle>
									<CardDescription className="text-[#5a5a5a]/70">
										Section 3.4 of the Policy
									</CardDescription>
								</CardHeader>
								<CardContent className="pt-6 text-[#5a5a5a]">
									<p>
										Non-compliance with this Policy is subject to disciplinary sanctions according
										to the Labor Code of the Republic of Kazakhstan and internal documents of the
										University.
									</p>
									<p className="mt-4">
										Evaluated and managed cases of conflicts of interest may not be used against the
										staff member or student in subsequent reviews, such as but not limited to
										admission, renewal, promotion, examination, or grant applications.
									</p>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</section>
			</main>
		</div>
	);
}
