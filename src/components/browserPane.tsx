import React from 'react';
export default function BrowserProvider({
	url,
	setUrl,
}: {
	url: string;
	setUrl: (url: string) => void;
}) {
	const [isLoading, setLoading] = React.useState(false);
	return (
		<div key={'browserpane'} className="flex-1 page darwin">
			{/* // nicely styled input textbox for a URL bar */}
			<div className="flex flex-row items-center justify-center w-full h-10 p-1 space-x-2 bg-gray-100 rounded-lg">
				<div className="flex items-center justify-center w-10 h-10 ml-2 text-gray-400">
					{isLoading ? (
						<svg
							fill="none"
							stroke="currentColor"
							className="w-4 h-4"
							strokeWidth={1.5}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					) : (
						<svg
							fill="none"
							stroke="currentColor"
							className="w-4 h-4"
							strokeWidth={1.5}
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
							/>
						</svg>
					)}
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setUrl(e.currentTarget.url.value);
						setLoading(true);
						document
							.querySelector('#browserpane')
							.addEventListener('did-stop-loading', () => {
								setLoading(false);
							});
					}}
				>
					<input
						type="text"
						name="url"
						className="w-full h-full px-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 rounded-lg focus:ring-0 focus:border-transparent"
						placeholder="Search"
					/>
				</form>
			</div>
			<webview
				// @ts-ignore - we need this to be here or it will not show up in electron and then the allowpopups doesnt work
				allowpopups="true"
				id={'browserpane'}
				src={url}
				zoomFactor={0.5}
				useragent={
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.37'
				}
			/>
		</div>
	);
}
