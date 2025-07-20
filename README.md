# 🚀 Space Shooter - High-Performance Cross-Platform Game

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Latest-119EFF.svg)](https://capacitorjs.com/)

> An intense space shooting game built with React and TypeScript, optimized for 120fps gameplay across all platforms: Android, iOS, Windows, Linux, and macOS.

## 👨‍💻 Developer

**Mohammed Shaheer Yasar Khan S** - Individual Game Developer

## 🌐 Cross-Platform Support

This game runs smoothly on all major platforms:
- **📱 Android** - Native mobile app via Capacitor
- **📱 iOS** - Native mobile app via Capacitor  
- **💻 Windows** - Web browser or Progressive Web App
- **🐧 Linux** - Web browser or Progressive Web App
- **🍎 macOS** - Web browser or Progressive Web App

### Performance Optimizations
- **120fps gameplay** with frame-independent movement system
- **Bug-free shooting mechanics** with optimized collision detection
- **Efficient particle system** for stunning visual effects
- **Memory-optimized** gameplay with minimal allocations

## ✨ Features

### 🎮 **Gameplay**
- **120fps Optimized Performance** - Smooth frame-independent movement and animations
- **Multiple Enemy Types** - Basic, Fast, Tank, and Boss enemies with unique behaviors
- **Power-up System** - Health, damage boost, speed boost, and multishot upgrades
- **Progressive Difficulty** - Increasing challenge with each level
- **Real-time Particle Effects** - Stunning explosion and visual feedback systems
- **Responsive Controls** - WASD/Arrow keys + mouse/click shooting

### 🎨 **Visual Excellence**
- **Custom Space Theme** - Professional dark theme with gradients and glows
- **Particle System** - Dynamic explosion and visual effect particles
- **Smooth Animations** - CSS animations with Tailwind for all UI elements
- **Responsive Design** - Works on various screen sizes
- **Modern UI Components** - Built with shadcn/ui components

### ⚡ **Technical Features**
- **Frame-Independent Movement** - Delta time calculations for consistent gameplay
- **Optimized Collision Detection** - Memoized collision algorithms for performance
- **TypeScript Safety** - Full type safety throughout the codebase
- **Component Architecture** - Clean, maintainable React components
- **Real-time Game Loop** - RequestAnimationFrame for 60-120fps performance

## 🎯 Game Mechanics

### Enemy Types
- **Basic** - Standard enemies with medium health and speed
- **Fast** - Quick enemies with low health but high speed
- **Tank** - Slow, heavily armored enemies
- **Boss** - Large enemies with high health appearing at level 5+

### Power-ups
- **🟢 Health** - Restores 30 health points
- **🔴 Damage** - Increases bullet damage by 0.5x
- **🟡 Speed** - Increases movement speed by 0.2x (max 2x)
- **🔵 Multishot** - Enables triple-shot for 10 seconds

### Controls
```
Movement: WASD or Arrow Keys
Shooting: SPACE or Left Click
Pause: P or Pause Button
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Web Development

```bash
# Clone the repository
git clone <your-repo-url>
cd space-shooter

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to play the game!

### Mobile App Development (Android/iOS)

1. **Export to GitHub** and clone the repository locally
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add mobile platforms:**
   ```bash
   npx cap add android  # For Android
   npx cap add ios      # For iOS (requires macOS)
   ```
4. **Build and sync:**
   ```bash
   npm run build
   npx cap sync
   ```
5. **Run on device/emulator:**
   ```bash
   npx cap run android  # For Android (requires Android Studio)
   npx cap run ios      # For iOS (requires macOS + Xcode)
   ```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 🔄 GitHub Sync

To sync this project with GitHub for collaborative development:

1. **Export to GitHub**: Use the "Export to GitHub" button in Lovable
2. **Clone locally**: 
   ```bash
   git clone <your-github-repo-url>
   cd <repo-name>
   ```
3. **Install and run**:
   ```bash
   npm install
   npm run dev
   ```
4. **Make changes and sync**:
   ```bash
   git add .
   git commit -m "Your improvements"
   git push origin main
   ```

The project automatically syncs between Lovable and GitHub for seamless development!

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Performance**: RequestAnimationFrame with delta time calculations

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── SpaceShooter.tsx # Main game component
├── pages/
│   └── Index.tsx        # Main page
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── index.css           # Design system & global styles
```

## 🎨 Design System

The game features a custom space-themed design system with:

- **Color Palette**: Deep space blues, electric blues, and accent colors
- **Gradients**: Custom CSS gradients for visual depth
- **Animations**: Smooth transitions and particle effects
- **Typography**: Modern, readable fonts
- **Shadows & Glows**: Dynamic lighting effects

## 🎯 Performance Optimizations

### 120fps Optimizations
- **Delta Time Calculations** - Frame-independent movement
- **Memoized Collision Detection** - Reduced computation overhead
- **Efficient State Updates** - Optimized React renders
- **RequestAnimationFrame** - Smooth 60-120fps game loop
- **Particle System Optimization** - Efficient particle lifecycle management

### Memory Management
- **Automatic Cleanup** - Bullets, enemies, and particles auto-cleanup
- **Event Listener Management** - Proper cleanup on component unmount
- **Optimized Re-renders** - Strategic use of useCallback and useMemo

## 🔧 Configuration

### Game Settings
The game can be customized by modifying constants in `SpaceShooter.tsx`:

```typescript
const GAME_WIDTH = 800;        // Game area width
const GAME_HEIGHT = 600;       // Game area height
const PLAYER_SPEED = 8;        // Player movement speed
const BULLET_SPEED = 12;       // Bullet velocity
```

### Styling
Custom the design system in `src/index.css` and `tailwind.config.ts` for:
- Color schemes
- Animations
- Gradients
- Shadows and effects

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Showcase

This game demonstrates:
- **Advanced React Patterns** - Hooks, performance optimization, component architecture
- **Game Development Skills** - Game loops, collision detection, particle systems
- **TypeScript Expertise** - Full type safety and advanced typing
- **Modern CSS** - Tailwind, custom design systems, animations
- **Performance Engineering** - 120fps optimization, memory management

Perfect for showcasing modern web development skills in portfolios and technical interviews!

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

🎮 **Ready to defend the galaxy? Start playing now!**