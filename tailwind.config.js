const colors = require('tailwindcss/colors');

module.exports = {
	content: [
		'./src/renderer/**/*.{js,jsx,ts,tsx,ejs}',
		'./src/components/**/*.{js,jsx,ts,tsx,ejs}',
	],
	darkMode: 'media', // or 'class'
	theme: {
		extend: {
			colors: {
				sky: colors.sky,
				cyan: colors.cyan,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
