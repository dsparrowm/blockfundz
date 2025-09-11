import type { Config } from "tailwindcss";

export default {
	// darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				white: '#FFFFFF',
				black: '#000000',
				blackred: '#660708', // very dark red/black for backgrounds
				orange: {
					DEFAULT: '#FF7A00', // main orange
					light: '#FFA940',
					dark: '#FF6600',
				},
				'timberwolf': {
					DEFAULT: '#D9D9D9', // light gray for backgrounds and borders
					light: '#EDEDED',
					dark: '#BFBFBF',
				},
				'red': {
					DEFAULT: '#C72C41', // main dark red
					dark: '#A61E34',
					light: '#FF4D6D',
				},
				'bloodred': {
					DEFAULT: '#E5383B', // bright red for accents and highlights
					dark: '#BA181B',
					light: '#FF6F61',
				},

				'em-green': {
					DEFAULT: '#10B981', // Emerald Green for success
					light: '#34D399',
					dark: '#047857',
				},
			},
			backgroundImage: {
				'crypto-gradient': 'linear-gradient(135deg, #0A2342 0%, #FF7A00 100%)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
