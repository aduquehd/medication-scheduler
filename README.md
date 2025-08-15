# Medication Scheduler

A modern web application for tracking medication schedules, built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- **Medication Management**: Add, edit, and remove medications with custom dosing intervals
- **Flexible Scheduling**: Set individual start times for each medication
- **Daily Dose Limits**: Configure maximum doses per day for each medication
- **24-Hour Schedule View**: Visual timeline of all medication doses throughout the day
- **Real-time Clock**: Live time display with current dose highlighting
- **Dark/Light Theme**: Toggle between dark and light modes
- **Import/Export**: Share schedules via JSON format
- **Interactive UI**: Hover over medications to highlight their doses in the schedule
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Persistent data storage in browser

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand
- **Build Tool**: Turbopack
- **Package Manager**: pnpm
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/medication-scheduler.git
cd medication-scheduler
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
pnpm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project and deploy

### Option 2: Deploy via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medication-scheduler.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

### Option 3: Direct Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/medication-scheduler)

## Build Commands

```bash
# Development with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Project Structure

```
medication-scheduler/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MedicationForm.tsx
│   ├── MedicationList.tsx
│   ├── ScheduleDisplay.tsx
│   ├── EditMedicationModal.tsx
│   └── ...
├── hooks/                 # Custom React hooks
│   └── useMedicationSchedule.ts
├── types/                 # TypeScript type definitions
│   └── medication.ts
├── utils/                 # Utility functions
│   ├── timeCalculations.ts
│   └── importExport.ts
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind CSS configuration
├── next.config.ts        # Next.js configuration
└── vercel.json          # Vercel deployment configuration
```

## Usage

1. **Add Medications**: 
   - Enter medication name
   - Set dosing interval (every X hours)
   - Choose start time
   - Optionally set maximum doses per day

2. **View Schedule**: 
   - See all doses for the next 24 hours
   - Current dose time is highlighted
   - Doses extending to next day are clearly marked

3. **Edit Medications**: 
   - Click the edit icon on any medication card
   - Update details in the modal
   - Changes are instantly reflected in the schedule

4. **Share Schedule**: 
   - Export schedule as JSON file
   - Import schedules from others
   - Copy schedule data to clipboard

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please use the GitHub issues page.