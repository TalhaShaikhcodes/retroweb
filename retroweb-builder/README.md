# 🌈 RetroWeb Builder

Transform modern websites into nostalgic 90s masterpieces with AI-powered retro design!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TalhaShaikhcodes/retroweb-builder)

## ✨ Features

- 🎨 **6 Retro Themes** - Geocities, Neon Cyber, Pixel Arcade, VHS Glitch, Vaporwave, Windows 95
- 🤖 **AI-Powered Builder** - Chat with AI to generate retro websites
- 🖼️ **GIF Library** - Hundreds of authentic 90s animated GIFs
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - Email/password and GitHub OAuth
- 💾 **Project Management** - Create up to 3 projects per user
- 🚀 **One-Click Deploy** - Export to GitHub Pages or download as ZIP
- 🎭 **Live Preview** - See your retro website in real-time

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/TalhaShaikhcodes/retroweb-builder.git
   cd retroweb-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **AI:** Google Gemini API
- **Deployment:** Vercel

## 🗂️ Project Structure

```
retroweb-builder/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── stores/           # Zustand stores
│   └── types/            # TypeScript types
├── public/               # Static assets
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Input validation and sanitization
- ✅ Rate limiting on API routes
- ✅ Secure authentication with email confirmation
- ✅ Environment variable protection
- ✅ CSRF protection
- ✅ SQL injection prevention

See [SECURITY_AUDIT_AND_FIXES.md](./SECURITY_AUDIT_AND_FIXES.md) for details.

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete Vercel deployment instructions
- [Security Audit](./SECURITY_AUDIT_AND_FIXES.md) - Security analysis and fixes
- [Email Confirmation Setup](./EMAIL_CONFIRMATION_SETUP.md) - Configure email verification
- [GIF Feature Guide](./GIF_FEATURE_COMPLETE.md) - GIF library implementation

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 🎨 Themes

### Available Themes

1. **Geocities Chaos Mode** - Maximum 90s homepage energy
2. **Neon Cyber 2001** - Matrix hacker aesthetic
3. **Pixel Arcade** - 8-bit retro gaming vibes
4. **VHS Analog Glitch** - VHS tracking errors
5. **Vaporwave A E S T H E T I C** - 80s/90s dreamscape
6. **Windows 95/98** - Classic desktop nostalgia

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the golden age of the internet (1995-2005)
- Built with modern web technologies
- Powered by AI for creative generation

## 📧 Contact

- GitHub: [@TalhaShaikhcodes](https://github.com/TalhaShaikhcodes)
- Project Link: [https://github.com/TalhaShaikhcodes/retroweb-builder](https://github.com/TalhaShaikhcodes/retroweb-builder)

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with 💜 and nostalgia for the 90s web**
