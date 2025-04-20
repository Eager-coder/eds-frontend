import {
	InitialDeclarationQuestionDto,
	InitialDeclarationQuestionOptionDto
} from '@/api-client/admin/initial-declarations/getInitialDeclarationById';
import AddOptionDialog from './AddOptionDialog';
import { Badge } from '@/components/ui/badge';
import { QuestionType } from '@/api-client/admin/initial-declarations/questions/createQuestion';
import { Option } from './Option';

interface Props {
	q: InitialDeclarationQuestionDto;

	onUpdate?: () => Promise<void>;
}

export function Question({ q, onUpdate }: Props) {
	return (
		<div key={q.id} className="space-y-4 rounded-lg border p-4">
			<div className="flex items-center gap-4 font-semibold">
				<span className="text-xl">#{q.orderNumber}</span>
				{q.isRequired ? (
					<span className="text-red-400">Required*</span>
				) : (
					<span className="text-gray-700">Not required</span>
				)}
			</div>
			<div className="flex gap-6">
				<h3 className="mb-2 flex gap-2 text-lg font-bold">
					<span>Type:</span>

					<Badge className="rounded-lg bg-zinc-700 px-2 py-0.5 text-base font-semibold text-white">
						{q.questionType.replace(/_/g, ' ')}
					</Badge>
				</h3>
			</div>
			<div className="text-sm"></div>
			<div className="font-normal">
				<h3 className="mb-2 text-lg font-bold">Question description:</h3>
				<ul className="mt-2 space-y-3 rounded-xl border-[0.5px] border-gray-700 bg-amber-50 p-3 text-gray-700">
					<li>
						<span className="font-bold">EN: </span> {q.description.en}
					</li>
					<div className="h-[0.5] w-full rounded-full bg-gray-700"></div>
					<li>
						<span className="font-bold">RU: </span> {q.description.ru}
					</li>
					<div className="h-[0.5] w-full rounded-full bg-gray-700"></div>

					<li>
						<span className="font-bold">KZ: </span> {q.description.kz}
					</li>
				</ul>
			</div>
			<div className="text-sm text-gray-700">
				<h3 className="mb-2 text-lg font-bold">Note:</h3>
				{q.note ? (
					<ul className="mt-2 space-y-3 rounded-xl border-[0.5px] border-gray-700 bg-zinc-50 p-4">
						<li>
							<span className="font-bold">EN: </span> {q.note.en}
						</li>
						<div className="h-[0.5] w-full rounded-full bg-gray-700"></div>

						<li>
							<span className="font-bold">RU: </span> {q.note.ru}
						</li>
						<div className="h-[0.5] w-full rounded-full bg-gray-700"></div>

						<li>
							<span className="font-bold">KZ: </span> {q.note.kz}
						</li>
					</ul>
				) : (
					<p>No notes</p>
				)}
			</div>

			{/* Options */}
			{q.options.length > 0 && (
				<div className="">
					<h3 className="mb-2 text-lg font-bold">Options:</h3>
					<div className="list-inside list-disc space-y-2 rounded-xl border-[0.5px] border-gray-700 bg-zinc-50 p-4">
						{q.options.map((opt, index) => (
							<Option
								option={opt}
								key={index}
								index={index}
								questionType={q.questionType}
								onAdd={onUpdate}
							/>
						))}
					</div>
				</div>
			)}
			{q.questionType === QuestionType.YES_NO ? (
				// YES_NO
				<>
					{q.options.length < 2 ? (
						<AddOptionDialog questionType={q.questionType} questionId={q.id} onAdded={onUpdate} />
					) : null}
				</>
			) : q.questionType === QuestionType.AGREE ? (
				// AGREE
				<>
					{q.options.length < 1 ? (
						<AddOptionDialog questionType={q.questionType} questionId={q.id} onAdded={onUpdate} />
					) : null}
				</>
			) : (
				// OPEN ENDED
				<>
					<AddOptionDialog questionType={q.questionType} questionId={q.id} onAdded={onUpdate} />
				</>
			)}
		</div>
	);
}

// function ShowOptionCreateDialog() {

// }
