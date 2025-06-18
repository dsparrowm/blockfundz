import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
				black: '#000000',
				orange: {
					DEFAULT: '#FF7A00', // main orange
					light: '#FFA940',
					dark: '#FF6600',
				},
				'dark-blue': {
					DEFAULT: '#0A2342', // main dark blue
					dark: '#06172B',
					light: '#1B3358',
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
