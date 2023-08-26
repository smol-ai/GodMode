import { Button } from 'renderer/components/ui/button';
import {
	Dialog,
	DialogXContent,
	DialogHeader,
	DialogTitle,
} from 'renderer/components/ui/dialog';
import { ProviderInterface } from 'lib/types';
import React from 'react';
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ReloadIcon,
	ResetIcon,
	ZoomInIcon,
	ZoomOutIcon,
	MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import { Input } from 'renderer/components/ui/input';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from 'renderer/components/ui/tooltip';

export default function Pane({
	provider,
	number,
	currentlyOpenPreviewPane,
	setOpenPreviewPane,
}: {
	provider: ProviderInterface;
	number: number;
	currentlyOpenPreviewPane: number;
	setOpenPreviewPane: (num: number) => void;
}) {
	const isPreviewOpen = currentlyOpenPreviewPane === number;
	const contentRef = React.useRef<HTMLDivElement>(null);

	const [shownUrl, setShownUrl] = React.useState(null);
	// this did not work not sure why
	// set a timer effect every second to check if the webview is can go back
	React.useEffect(() => {
		const interval = setInterval(() => {
			// @ts-ignore
			const newUrl = provider.getWebview()?.src;
			if (newUrl !== shownUrl) setShownUrl(newUrl);
		}, 1000);
		return () => clearInterval(interval);
	});

	// this did not work not sure why
	// // set a timer effect every second to check if the webview is can go back
	// const [canGoBack, setCanGoBack] = React.useState(false);
	// const [canGoFwd, setCanGoFwd] = React.useState(false);
	// React.useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		console.log(
	// 			'provider.getWebview()?.canGoBack()',
	// 			provider.getWebview(),
	// 			provider.getWebview()?.canGoBack()
	// 		);
	// 		// @ts-ignore
	// 		if (provider.getWebview()?.canGoBack()) {
	// 			setCanGoBack(true);
	// 		} else {
	// 			setCanGoBack(false);
	// 		}
	// 		// @ts-ignore
	// 		if (provider.getWebview()?.canGoForward()) {
	// 			setCanGoFwd(true);
	// 		} else {
	// 			setCanGoFwd(true);
	// 		}
	// 	}, 1000);
	// 	return () => clearInterval(interval);
	// });

	function XButton({ children, tooltip, onClick, className = '' }: any) {
		return (
			<TooltipProvider delayDuration={300}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							className={`hover:bg-gray-200 ${className}`}
							onClick={onClick}
						>
							{children}
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" className="text-white bg-black">
						<p>{tooltip}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<div key={provider.paneId()} className="page darwin group">
			<div className="hidden powerbar group-hover:block">
				<Button
					className="text-xs shadow-2xl"
					onClick={() => setOpenPreviewPane(number)}
					variant="ghost"
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11.5 3.04999C11.7485 3.04999 11.95 3.25146 11.95 3.49999V7.49999C11.95 7.74852 11.7485 7.94999 11.5 7.94999C11.2515 7.94999 11.05 7.74852 11.05 7.49999V4.58639L4.58638 11.05H7.49999C7.74852 11.05 7.94999 11.2515 7.94999 11.5C7.94999 11.7485 7.74852 11.95 7.49999 11.95L3.49999 11.95C3.38064 11.95 3.26618 11.9026 3.18179 11.8182C3.0974 11.7338 3.04999 11.6193 3.04999 11.5L3.04999 7.49999C3.04999 7.25146 3.25146 7.04999 3.49999 7.04999C3.74852 7.04999 3.94999 7.25146 3.94999 7.49999L3.94999 10.4136L10.4136 3.94999L7.49999 3.94999C7.25146 3.94999 7.04999 3.74852 7.04999 3.49999C7.04999 3.25146 7.25146 3.04999 7.49999 3.04999L11.5 3.04999Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>{' '}
					Cmd + {number}
				</Button>
			</div>
			<Dialog open={isPreviewOpen} onOpenChange={() => setOpenPreviewPane(0)}>
				<DialogXContent
					className="bg-white pointer-events-none"
					ref={contentRef}
				>
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between pr-8">
							{provider.fullName}
							<div className="flex">
								<XButton
									tooltip="Cmd + ="
									onClick={() => {
										provider
											.getWebview()
											// @ts-ignore
											.setZoomLevel(provider.getWebview().getZoomLevel() + 1);
									}}
								>
									<ZoomInIcon />
								</XButton>
								<XButton
									tooltip="Cmd + -"
									onClick={() => {
										provider
											.getWebview()
											// @ts-ignore
											.setZoomLevel(provider.getWebview().getZoomLevel() - 1);
									}}
								>
									<ZoomOutIcon />
								</XButton>
								<XButton
									tooltip="Cmd + 0"
									onClick={() => {
										provider
											.getWebview()
											// @ts-ignore
											.setZoomLevel(0);
									}}
								>
									<MagnifyingGlassIcon />
								</XButton>
							</div>
							<Input type="url" value={shownUrl || ''} readOnly={true} />
							<div className="flex">
								<XButton
									tooltip="Cmd + R"
									className="mr-4"
									onClick={() => {
										const webview = provider.getWebview();
										if (typeof webview?.refresh === 'function') {
											webview?.refresh();
										} else {
											webview?.reload();
										}
									}}
								>
									<ReloadIcon />
								</XButton>
								<XButton
									tooltip="Cmd + h"
									onClick={() => {
										provider.getWebview()?.goBack();
									}}
								>
									<ArrowLeftIcon />
								</XButton>
								<XButton
									tooltip="Cmd + ;"
									onClick={() => {
										provider.getWebview()?.goForward();
									}}
								>
									<ArrowRightIcon />
								</XButton>
								{provider.clearCookies && (
									<Button
										variant="outline"
										onClick={() => {
											provider.clearCookies();
										}}
									>
										<ResetIcon className="mr-1" /> Clear Cookies
									</Button>
								)}
							</div>
						</DialogTitle>
					</DialogHeader>
				</DialogXContent>
			</Dialog>
			<webview
				// @ts-ignore - we need this to be here or it will not show up in electron and then the allowpopups doesnt work
				allowpopups="true"
				id={provider.webviewId}
				src={provider.url}
				className={
					isPreviewOpen
						? 'fixed pointer-events-auto left-[5%] top-[10%] z-[100] grid w-10/12 gap-4 p-2 duration-200 sm:rounded-lg rounded-xl h-[85vh]'
						: ''
				}
				useragent={
					provider.getUserAgent() ? provider.getUserAgent() : undefined
				}
			/>
		</div>
	);
}
