import {
	InitialDeclarationAdditionalOptionDto,
	initialDeclarationKeys,
	InitialDeclarationQuestionOptionDto
} from '@/api-client/admin/initial-declarations/getInitialDeclarationById';
import { QuestionType } from '@/api-client/admin/initial-declarations/questions/createQuestion';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { AdditionalOptionModal } from './AdditionalOptionModal';
import { deleteOption } from '@/api-client/admin/initial-declarations/options/deleteOption';
import { queryClient } from '@/app/layout';

interface Props {
	option: InitialDeclarationQuestionOptionDto;
	index: number;
	questionType: QuestionType;
	onAdd?: () => Promise<void>;
}

export function Option({ option, index, questionType, onAdd }: Props) {
	const handleDelete = async () => {
		await deleteOption(option.id);
		queryClient.invalidateQueries({
			queryKey: initialDeclarationKeys.all
		});
		if (onAdd) {
			onAdd();
		}
	};

	return (
		<div className="relative space-y-4 rounded-lg border-[0.5px] border-gray-700 bg-zinc-100 p-4">
			<Button
				onClick={handleDelete}
				className="absolute top-2 right-2 cursor-pointer text-red-500 hover:text-red-700"
				variant={'outline'}
			>
				<Trash2 />
			</Button>
			<h4 className="mb-2 font-bold">Option # {index + 1}</h4>
			<p className="mb-2 font-semibold">Option Description:</p>
			<ul className="space-y-2 rounded-lg border-[0.5px] border-gray-700 bg-amber-50/45 p-4 text-gray-800">
				<li>
					<span className="font-bold">RU: </span> {option.description.ru}
				</li>
				<hr />
				<li>
					<span className="font-bold">EN: </span> {option.description.en}
				</li>
				<hr />
				<li>
					<span className="font-bold">KZ: </span> {option.description.kz}
				</li>
			</ul>
			<div className="text-sm">
				Multiple Additional Answers: {option.multipleAdditionalAnswers ? 'Yes' : 'No'}
			</div>
			{option.additionalOption.length > 0 && (
				<>
					<div className="font-medium">Additional Options:</div>
					<div className="rounded-xl border-[0.5px] border-gray-700 bg-zinc-200 p-4">
						<ul className="list-inside list-disc space-y-1">
							{option.additionalOption.map((ao, index) => (
								<AdditionalOption option={ao} key={index} index={index} />
							))}
						</ul>
					</div>
				</>
			)}
			{questionType !== QuestionType.AGREE && <AdditionalOptionModal optionId={option.id} onAdd={onAdd} />}
		</div>
	);
}

function AdditionalOption({ option, index }: { option: InitialDeclarationAdditionalOptionDto; index: number }) {
	return (
		<div className="space-y-2">
			<h4 className="font-semibold">
				Additional Option #{index + 1}
				{option.isRequired ? <span className="ml-2 text-red-400">Required*</span> : null}
			</h4>
			<p className="font-semibold">Description: </p>

			<ul className="space-y-2 rounded-lg border-[0.5px] border-gray-700 bg-zinc-300 p-4 text-gray-900">
				<li>RU: {option.description.ru}</li>
				<hr />
				<li>EN: {option.description.en}</li>
				<hr />
				<li>KZ: {option.description.kz}</li>
			</ul>
		</div>
	);
}
