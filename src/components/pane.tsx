import { ProviderInterface } from 'lib/types';

export default function Pane({ provider }: { provider: ProviderInterface }) {
	return (
		<div key={provider.paneId()} className="page darwin">
			<webview
				// @ts-ignore - we need this to be here or it will not show up in electron and then the allowpopups doesnt work
				allowpopups="true"
				id={provider.webviewId}
				src={provider.url}
				useragent={
					provider.getUserAgent() ? provider.getUserAgent() : undefined
				}
			/>
		</div>
	);
}
