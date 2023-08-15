import { ProviderInterface } from 'lib/types';

export default function Pane({ provider }: { provider: ProviderInterface }) {
	return (
		<div key={provider.paneId()} className="page darwin">
			<webview
				allowpopups={true}
				id={provider.webviewId}
				src={provider.url}
				useragent={
					provider.getUserAgent() ? provider.getUserAgent() : undefined
				}
			/>
		</div>
	);
}
