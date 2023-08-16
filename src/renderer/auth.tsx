// auth/Settings.tsx
import React from 'react';

const Auth: React.FC = () => {
	const signIn = () => {
		// ipcRenderer.send('github-oauth', 'getToken');
	};

	return (
		<div>
			<h1>Auth</h1>
			<button onClick={signIn}>Sign in with Github</button>
			{/* Your settings content */}
		</div>
	);
};

export default Auth;
