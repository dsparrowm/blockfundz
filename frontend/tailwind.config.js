/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	fontSize: {
  		xs: ['12px', '16px'],
  		sm: ['14px', '20px'],
  		base: ['16px', '19.5px'],
  		lg: ['18px', '21.94px'],
  		xl: ['20px', '24.38px'],
  		'2xl': ['24px', '29.26px'],
  		'3xl': ['28px', '50px'],
  		'4xl': ['48px', '58px'],
  		'8xl': ['96px', '106px']
  	},
  	extend: {
  		fontFamily: {
  			palanquin: ['Palanquin', 'sans-serif'],
  			montserrat: ['Montserrat', 'sans-serif']
  		},
  		animation: {
  			twinkle: 'twinkle 4s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			twinkle: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.2'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		colors: {
  			primary: '#ECEEFF',
  			'coral-red': '#FF6452',
  			'coral-black': '#010202',
  			'coral-green': 'CFFF24',
  			'slate-gray': '#6D6D6D',
  			'pale-blue': '#F5F6FF',
  			'white-400': 'rgba(255, 255, 255, 0.80)',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		boxShadow: {
  			'3xl': '0 10px 40px rgba(0, 0, 0, 0.1)'
  		},
  		screens: {
  			wide: '1440px'
  		}
  	}
  },
  plugins: [],
}