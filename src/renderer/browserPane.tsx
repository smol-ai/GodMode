import { Fragment } from 'react';
import { Menu, Listbox, Transition } from '@headlessui/react';
import {
	Bars2Icon,
	ChevronUpDownIcon,
	CheckIcon,
} from '@heroicons/react/20/solid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// https://tailwindui.com/components/application-ui/elements/dropdowns
function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const grid = 2;

export function BrowserPane({
	paneList,
	setPaneList,
	resetPaneList,
	nonEnabledProviders,
}) {
	const nullProvider = {
		webviewId: 'nullProvider',
		shortName: 'Select a provider',
		fullName: 'Select a provider',
	};

	function onDragEnd(result: {
		source: { index: number };
		destination: { index: number };
	}) {
		// dropped outside the list
		if (!result.destination) return;

		const reorderedItems = reorder(
			paneList,
			result.source.index,
			result.destination.index
		);
		setPaneList(reorderedItems);
		window.electron.browserWindow.reload();
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div className="flex flex-col justify-between">
						<Menu as="div" className="relative inline-block text-left">
							<div>
								<Menu.Button className="inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
									<Bars2Icon
										className="w-4 h-4 text-gray-400"
										aria-hidden="true"
									/>
								</Menu.Button>
							</div>

							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-bottom-right bg-white divide-y divide-gray-100 rounded-md shadow-lg bottom-10 ring-1 ring-black ring-opacity-5 focus:outline-none">
									<div className="py-1">
										<Menu.Item>
											{() => (
												<span className="block px-4 py-2 text-sm text-gray-700">
													Drag to reorder, Click to hide
												</span>
											)}
										</Menu.Item>
									</div>
									<div className="py-0">
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className={`w-full ${
												snapshot.isDraggingOver ? 'bg-blue-200' : 'bg-gray-200'
											}`}
										>
											{paneList?.map((item, index) => (
												<Draggable
													key={item.webviewId}
													draggableId={item.webviewId}
													index={index}
												>
													{(provided, snapshot) => {
														const hidePane = () =>
															setPaneList(
																paneList.filter(
																	(pane: any) =>
																		pane.webviewId !== item.webviewId
																)
															);
														return (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className={` user-select-none px-4 py-2 mb-2 text-sm flex group justify-between items-center ${
																	snapshot.isDragging
																		? 'bg-green-200'
																		: 'bg-gray-200'
																}
															`}
																style={provided.draggableProps.style}
															>
																{item.shortName}
																<button
																	className="hidden w-4 h-4 group-hover:flex"
																	onClick={hidePane}
																>
																	<svg
																		fill="#000000"
																		height="100%"
																		width="100%"
																		version="1.1"
																		id="Layer_1"
																		xmlns="http://www.w3.org/2000/svg"
																		xmlnsXlink="http://www.w3.org/1999/xlink"
																		viewBox="0 0 489.658 489.658"
																		xmlSpace="preserve"
																	>
																		<g
																			id="SVGRepo_bgCarrier"
																			strokeWidth="0"
																		></g>
																		<g
																			id="SVGRepo_tracerCarrier"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																		></g>
																		<g id="SVGRepo_iconCarrier">
																			{' '}
																			<path d="M485.313,252.34l4.345-7.511l-4.345-7.511c-23.974-41.44-58.446-76.197-99.691-100.511 c-42.473-25.038-91.117-38.28-140.681-38.3c-0.037,0-0.074-0.001-0.112-0.001s-0.074,0.001-0.112,0.001 c-36.01,0.014-71.531,7.015-104.556,20.441L27.936,6.723L6.723,27.936L111.407,132.62c-2.476,1.358-4.935,2.751-7.371,4.187 c-41.245,24.314-75.718,59.07-99.691,100.511L0,244.829l4.345,7.511c23.974,41.44,58.446,76.197,99.691,100.511 c42.473,25.038,91.117,38.28,140.681,38.3c0.037,0,0.074,0.001,0.112,0.001s0.074-0.001,0.112-0.001 c36.01-0.014,71.531-7.015,104.556-20.441l112.226,112.226l21.213-21.213L378.251,357.038c2.476-1.358,4.935-2.751,7.371-4.187 C426.867,328.537,461.34,293.781,485.313,252.34z M454.819,244.829c-22.94,36.587-54.809,66.03-91.791,86.144 c17.673-24.184,28.124-53.964,28.124-86.144s-10.45-61.96-28.124-86.144C400.01,178.799,431.879,208.242,454.819,244.829z M244.829,361.152c-0.036,0-0.071-0.001-0.107-0.001c-64.092-0.058-116.217-52.217-116.217-116.322 c0-26.675,9.031-51.276,24.189-70.922l47.815,47.815c-3.621,6.916-5.681,14.773-5.681,23.106c0,27.57,22.43,50,50,50 c8.333,0,16.19-2.06,23.106-5.681l47.815,47.815c-19.619,15.137-44.181,24.163-70.815,24.187 C244.9,361.151,244.865,361.152,244.829,361.152z M244.829,128.506c0.036,0,0.071,0.001,0.107,0.001 c64.092,0.058,116.217,52.217,116.217,116.322c0,26.675-9.031,51.276-24.189,70.922l-47.815-47.815 c3.621-6.916,5.681-14.773,5.681-23.106c0-27.57-22.43-50-50-50c-8.333,0-16.19,2.06-23.106,5.681l-47.815-47.815 c19.619-15.137,44.181-24.163,70.815-24.187C244.758,128.507,244.793,128.506,244.829,128.506z M34.839,244.829 c22.94-36.587,54.809-66.03,91.791-86.144c-17.673,24.184-28.124,53.964-28.124,86.144s10.45,61.96,28.124,86.144 C89.648,310.859,57.779,281.416,34.839,244.829z"></path>{' '}
																		</g>
																	</svg>
																</button>
															</div>
														);
													}}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
										<Menu.Item>
											{({ active }) => (
												// <button
												// 	// className="flex items-center justify-center px-4 py-2 text-white bg-teal-700 rounded hover:bg-teal-500"
												// 	className={classNames(
												// 		active
												// 			? 'bg-gray-100 text-gray-900'
												// 			: 'text-gray-700',
												// 		'block w-full px-4 py-2 text-sm'
												// 	)}
												// 	onClick={resetPaneList}
												// >
												// 	Add new provider
												// </button>
												<div className="px-4 pb-2">
													<ListBox
														selected={nullProvider}
														selectList={[nullProvider, ...nonEnabledProviders]}
														setSelected={(value: any) => {
															console.log('setselected', value);
															if (nullProvider.webviewId !== value.webviewId) {
																setPaneList([
																	...paneList,
																	{
																		webviewId: value.webviewId,
																		shortName: value.shortName,
																	},
																]);
															}
														}}
													/>
												</div>
											)}
										</Menu.Item>
									</div>
									<div className="py-1">
										<Menu.Item>
											{({ active }) => (
												<a
													href="https://github.com/smol-ai/menubar/issues/new"
													// className="flex items-center justify-center px-4 py-2 text-white bg-teal-700 rounded hover:bg-teal-500"
													className={classNames(
														active
															? 'bg-gray-100 text-gray-900'
															: 'text-gray-700',
														'block px-4 py-2 text-sm'
													)}
													onClick={resetPaneList}
												>
													Share Feedback
												</a>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													// className="flex items-center justify-center px-4 py-2 text-white bg-teal-700 rounded hover:bg-teal-500"
													className={classNames(
														active
															? 'bg-gray-100 text-red-900'
															: 'text-red-700',
														'block px-4 py-2 text-sm'
													)}
													onClick={resetPaneList}
												>
													Reset to default
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

// https://tailwindui.com/components/application-ui/forms/select-menus
export default function ListBox({ selected, setSelected, selectList }) {
	return (
		<Listbox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
						Add new Provider
					</Listbox.Label>
					<div className="relative mt-2">
						<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
							<span className="block truncate">{selected.shortName}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<ChevronUpDownIcon
									className="w-5 h-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>

						<Transition
							show={open}
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute right-0 z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg bottom-8 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								{selectList.map((listItem) => (
									<Listbox.Option
										key={listItem.webviewId}
										className={({ active }) =>
											classNames(
												active ? 'bg-indigo-600 text-white' : 'text-gray-900',
												'relative cursor-default select-none py-2 pl-3 pr-9'
											)
										}
										value={listItem}
									>
										{({ selected, active }) => (
											<>
												<span
													className={classNames(
														selected ? 'font-semibold' : 'font-normal',
														'block truncate'
													)}
												>
													{listItem.fullName}
												</span>

												{selected ? (
													<span
														className={classNames(
															active ? 'text-white' : 'text-indigo-600',
															'absolute inset-y-0 right-0 flex items-center pr-4'
														)}
													>
														<CheckIcon className="w-5 h-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</>
			)}
		</Listbox>
	);
}
