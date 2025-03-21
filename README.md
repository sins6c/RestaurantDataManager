## 🍽️ Restaurant Data Management System
A modern web application for managing restaurant data, customer information, and QR code generation. Built with React, TypeScript, and Vite.
## ✨ Key Features
👥 Customer Management

- Track customer information and preferences
- Custom form creation for data collection
- Data visualization and insights

📊 Admin Dashboard

- Comprehensive overview of restaurant data
- Real-time analytics and reporting
- User-friendly interface for restaurant management

📱 QR Code Generation

- Generate custom QR codes for menus and promotions
- Link digital assets to physical restaurant experience
- Streamline customer ordering process

🛠️ Technology Stack

- Frontend: React with TypeScript
- Build Tool: Vite
- Styling: TailwindCSS
- Linting: ESLint
- Type Checking: TypeScript
- Package Management: npm/yarn

## 🚀 Getting Started
📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

📥 Installation Steps

### 1. Clone the Repository
```
bashCopygit clone [your-repository-url]
cd restaurant-data
```

### 2. Install Dependencies
```
bashCopynpm install
# or
yarn
```

### 3. Start Development Server
```
bashCopynpm run dev
# or
yarn dev
```

### 4. Build for Production
```
bashCopynpm run build
# or
yarn build
```


## 📁 Project Structure
```
restaurant-data/
│
├── dist/                   # Build output
│   └── assets/            # Compiled assets
│
├── node_modules/          # Dependencies
│
├── src/                   # Source files
│   ├── components/        # React components
│   │   ├── CustomerData.tsx     # Customer data display
│   │   ├── CustomerForm.tsx     # Customer data input form
│   │   ├── Dashboard.tsx        # Admin dashboard
│   │   ├── Layout.tsx           # Main layout component
│   │   └── QRCodeGenerator.tsx  # QR code generation tool
│   │
│   ├── utils/             # Utility functions
│   │   ├── formConfig.ts  # Form configuration
│   │   └── storage.ts     # Data storage utilities
│   │
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Application entry point
│   ├── types.ts          # TypeScript type definitions
│   └── vite-env.d.ts     # Vite environment definitions
│
├── .gitignore            # Git ignore file
├── config.json           # Application configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package-lock.json     # Dependency lock file
├── package.json          # Project metadata and dependencies
├── postcss.config.js     # PostCSS configuration
├── README.md             # Project documentation
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.app.json     # TypeScript app configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript Node configuration
└── vite.config.ts        # Vite configuration
```
