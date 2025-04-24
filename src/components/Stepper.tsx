'use client';

import type React from 'react';

export interface StepProps {
	name: string;
	description: string;
	isActive: boolean;
	isCompleted: boolean;
	isLast: boolean;
	hasConflict: boolean;
}

const Step: React.FC<StepProps> = ({ name, description, isActive, isCompleted, isLast, hasConflict }) => {
	return (
		<div className="relative flex w-full items-stretch">
			<div
				className={`flex w-full flex-col justify-center px-6 py-2 ${
					hasConflict
						? 'bg-red-500'
						: isActive
							? 'bg-green-600'
							: isCompleted
								? 'bg-green-600 text-zinc-900'
								: 'border border-slate-200 bg-zinc-200 text-slate-700'
				} ${!isLast ? 'pr-10' : ''} relative z-10 min-w-[200px]`}
				style={{
					clipPath: 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%)'
				}}
			>
				<div
					className={`text-base font-semibold ${isActive || isCompleted || hasConflict ? 'text-white' : 'text-zinc-900'}`}
				>
					{description}
				</div>
			</div>
		</div>
	);
};

interface StepperProps {
	title: string;
	steps: Array<{
		name: string;
		description: string;
	}>;
	hasConflict: boolean;
	activeStep: number;
}

export default function Stepper({ title, steps, activeStep, hasConflict }: StepperProps) {
	return (
		<div className="w-full max-w-5xl border-none bg-zinc-50">
			<div className="flex gap-2">
				{steps.map((step, index) => (
					<Step
						hasConflict={hasConflict}
						key={index}
						name={step.name}
						description={step.description}
						isActive={index === activeStep}
						isCompleted={index < activeStep}
						isLast={index === steps.length - 1}
					/>
				))}
			</div>
		</div>
	);
}
