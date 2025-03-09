# Next Crypto Manager 📈

A modern cryptocurrency management and tracking platform built with Next.js, TypeScript, Material-UI, and Framer Motion. The platform provides real-time market data, interactive charts, portfolio tracking, and live news updates with a sleek dark-themed UI.

![Ekran görüntüsü 2025-03-09 170028](https://github.com/user-attachments/assets/ca95445d-518c-44d3-8bda-0b1a1fd730ce)


## Features 🚀

### Dashboard
- Real-time market overview with key statistics
- Bitcoin price chart with 7-day historical data
- Market dominance visualization
- Active cryptocurrencies and markets count
- Total market capitalization tracking

### Markets
- Live cryptocurrency price tracking
- Top gainers and losers with 20 entries each
- Advanced sorting and filtering capabilities
- Favorite cryptocurrency marking system
- Detailed price information including:
  - Current price
  - 24h price change
  - Market cap
  - Trading volume
- Interactive table with pagination
- Click-through to detailed cryptocurrency pages

### Portfolio
- Sample portfolio with real-time value tracking
- Profit/Loss calculation
- Asset management with:
  - Purchase price tracking
  - Current value calculation
  - Profit/Loss percentage
  - 24h price changes
- Remove assets functionality
- Total portfolio value overview

### News
- Latest cryptocurrency news from CoinGecko
- Article cards with thumbnails
- Author and publication date
- Direct links to full articles
- Auto-refresh every 5 minutes

### Crypto Detail Pages
- Detailed cryptocurrency information
- 7-day price chart
- Key metrics including:
  - Market cap
  - Trading volume
  - 24h price range
- Real-time price updates


![Ekran görüntüsü 2025-03-09 170113](https://github.com/user-attachments/assets/ce717309-01d4-4b3f-a21c-afdf3b92f024)



## Technology Stack 💻

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **API Integration**: Axios
- **Data Source**: CoinGecko API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS

## Getting Started 🏁

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kalzimkholodros/Next-CryptoManager.git
```

2. Navigate to the project directory:

```bash
cd next-crypto-manager
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:3000`

## Data Updates ⚡

- Market data refreshes every 60 seconds
- News updates every 5 minutes
- Portfolio values update in real-time
- Top Gainers/Losers tables show:
  - Top 20 cryptocurrencies with highest price increase (24h)
  - Top 20 cryptocurrencies with highest price decrease (24h)
  - Real-time price and percentage changes
  - Market cap and volume information

## Charts and Graphs 📊

- **Price Charts**: 
  - 7-day historical data
  - Interactive tooltips
  - Gradient fill
  - Responsive design
  - Real-time updates
  - Custom styling with dark theme

- **Market Dominance**:
  - Top 5 cryptocurrencies by market cap
  - Percentage representation
  - Visual indicators

## Performance Optimizations 🚀

- Dynamic imports for better loading times
- Image optimization with Next.js Image component
- Debounced search functionality
- Efficient data caching
- Optimized re-renders
- Lazy loading for components

## UI/UX Features 🎨

- Responsive design for all screen sizes
- Dark theme with neon accents
- Smooth animations and transitions
- Loading skeletons for better UX
- Interactive elements with hover effects
- Modern glassmorphism design
- Custom scrollbars
- Error handling with user feedback

## Contributing 🤝

Feel free to contribute to this project by submitting issues and/or pull requests. Please read the contributing guidelines before submitting any changes.

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.

