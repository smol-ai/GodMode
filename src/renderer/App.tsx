import { Route, HashRouter as Router, Routes } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
// https://electron-react-boilerplate.js.org/docs/styling#tailwind-integration
import 'tailwindcss/tailwind.css';
import './App.css';
import Auth from './auth';
import Layout from './layout';

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout />} />
				<Route path="/auth" element={<Auth />} />
			</Routes>
		</Router>
	);
}
