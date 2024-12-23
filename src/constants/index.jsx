import { facebook, instagram, shieldTick, support, truckFast, twitter } from "../assets/icons";
import { bigShoe1, bigShoe2, bigShoe3, customer1, customer2, shoe4, shoe5, shoe6, shoe7, thumbnailShoe1, happyMan, thumbnailShoe2, thumbnailShoe3 } from "../assets/images";

import { 
    Home,
    Wallet,
    ArrowDownCircle,
    ArrowUpCircle,
    Settings,
    Users,
    History,
    BarChart3,
    UserCog,
    Shield,
    Database,
    TrendingUp,
  } from "lucide-react"


export const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#howitworks", label: "How it works" },
    { href: "#about-us", label: "About Us" },
    { href: "#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact Us" },
];

export const authLinks = [
    { href: "#login", label: "Login" },
    { href: "#signup", label: "Signup" },
]

export const shoes = [
    {
        thumbnail: thumbnailShoe1,
        bigShoe: bigShoe1,
    },
    {
        thumbnail: thumbnailShoe2,
        bigShoe: bigShoe2,
    },
    {
        thumbnail: thumbnailShoe3,
        bigShoe: bigShoe3,
    },
];

export const statistics = [
    { value: '20k+', label: 'Investors'},
    { value: '100M+', label: 'Deposits' },
    { value: '500M+', label: 'Withdrawals' },
];

export const products = [
    {
        imgURL: shoe4,
        name: "Nike Air Jordan-01",
        balance: "$200.20",
    },
    {
        imgURL: shoe5,
        name: "Nike Air Jordan-10",
        balance: "$210.20",
    },
    {
        imgURL: shoe6,
        name: "Nike Air Jordan-100",
        balance: "$220.20",
    },
    {
        imgURL: shoe7,
        name: "Nike Air Jordan-001",
        balance: "$230.20",
    },
];

export const services = [
    {
        imgURL: truckFast,
        label: "Free shipping",
        subtext: "Enjoy seamless shopping with our complimentary shipping service."
    },
    {
        imgURL: shieldTick,
        label: "Secure Payment",
        subtext: "Experience worry-free transactions with our secure payment options."
    },
    {
        imgURL: support,
        label: "Love to help you",
        subtext: "Our dedicated team is here to assist you every step of the way."
    },
];

export const reviews = [
    {
        imgURL: customer1,
        customerName: 'Morich Brown',
        rating: 4.5,
        feedback: "The attention to detail and the quality of the product exceeded my expectations. Highly recommended!"
    },
    {
        imgURL: customer2,
        customerName: 'Lota Mongeskar',
        rating: 4.5,
        feedback: "The product not only met but exceeded my expectations. I'll definitely be a returning customer!"
    }
];


export const footerLinks = [
    {
        title: "Products",
        links: [
            { name: "Air Force 1", link: "/" },
            { name: "Air Max 1", link: "/" },
            { name: "Air Jordan 1", link: "/" },
            { name: "Air Force 2", link: "/" },
            { name: "Nike Waffle Racer", link: "/" },
            { name: "Nike Cortez", link: "/" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "About us", link: "/" },
            { name: "FAQs", link: "/" },
            { name: "How it works", link: "/" },
            { name: "Privacy policy", link: "/" },
            { name: "Payment policy", link: "/" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "customer@nike.com", link: "mailto:customer@nike.com" },
            { name: "+92554862354", link: "tel:+92554862354" },
        ],
    },
];

export const socialMedia = [
    { src: facebook, alt: "facebook logo" },
    { src: twitter, alt: "twitter logo" },
    { src: instagram, alt: "instagram logo" },
];

export const features = [
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: "Secure Platform",
      description: "Industry-leading security protocols and cold storage solutions to protect your digital assets"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "Smart Investment Plans",
      description: "Carefully curated investment strategies optimized for various risk appetites and market conditions"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Expert Team",
      description: "Backed by seasoned crypto traders, blockchain developers, and financial experts"
    }
  ];

 export const stats = [
    { value: "$500M+", label: "Assets Managed" },
    { value: "50K+", label: "Active Investors" },
    { value: "99.9%", label: "Uptime" }
  ];

  export const coins = [
    { name: "Bitcoin", balance: "$5,000", change: "+2.5%", },
    { name: "Ethereum", balance: "$3,500", change: "+3.5%", },
    { name: "Usdt", balance: "$180", change: "+1.5%", },
    { name: "Usdc", balance: "$0.75", change: "+1.2%", },
  ];

  export const payments = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // ...
  ]

  export const data = {
    // User navigation items
    userNavMain: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        isActive: true,
        onclick: () => {}
      },
      {
        title: "Invest",
        url: "/dashboard/deposits",
        icon: ArrowDownCircle,
        onclick: () => {}
      },
      // {
      //   title: "Investments",
      //   url: "/dashboard/withdrawals",
      //   icon: ArrowUpCircle,
      //   onclick: () => {}
      // },
      {
        title: "Deposits",
        url: "/dashboard/wallet",
        icon: Wallet,
        onclick: () => {}
      },
      {
        title: "DepositHistory",
        url: "/dashboard/history",
        icon: History,
        onclick: () => {}
      },
      {
        title: "Withdrawals",
        url: "/dashboard/settings",
        icon: Settings,
        onclick: () => {}
      },
      {
        title: "WithdrawalHistory",
        url: "/dashboard/settings",
        icon: Settings,
        onclick: () => {}
      },
    ],
  
    // Admin navigation items
    adminNavMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
        isActive: true,
        onclick: () => {}
      },
      {
        title: "Users Management",
        url: "/admin/users",
        icon: Users,
        onclick: () => {}
      },
      // {
      //   title: "Manage Investments",
      //   url: "/admin/investments",
      //   icon: BarChart3,
      //   onclick: () => {}
      // },
      {
        title: "Manage Transactions",
        url: "/admin/transactions",
        icon: UserCog,
        onclick: () => {}
      },
      {
        title: "Withdrawal Requests",
        url: "/admin/withdrawals",
        icon: Shield,
        onclick: () => {}
      },
      {
        title: "Manage Plans",
        url: "/admin/settings",
        icon: Database,
        onclick: () => {}
      },
      {
        title: "Send Mail",
        url: "/admin/mail",
        icon: Database,
        onclick: () => {}
      }
    ],
  }

  export const userData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      balance: 56000,
      createdAt: '2023-04-01'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      balance: 35000,
      createdAt: '2023-03-15'
    },
    // Add more users as needed
  ];