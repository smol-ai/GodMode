export function TitleBar({ isAlwaysOnTop, toggleIsAlwaysOnTop }: any) {
	return (
		<div
			id="titlebar"
			className="flex items-center justify-center px-4 text-white bg-gray-900"
		>
			<h1 className="bg-gray-900">🐢 GodMode</h1>
			<button
				className="flex items-center cursor-pointer hover:text-green-300"
				onClick={toggleIsAlwaysOnTop}
			>
				{isAlwaysOnTop ? (
					<>
						<svg
							className="inline w-4 h-4 ml-4"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
							/>
						</svg>
						Pinned
					</>
				) : (
					<svg
						className="inline w-4 h-4 ml-4"
						// display text on hover
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
						/>
					</svg>
				)}
			</button>
		</div>
	);
}
