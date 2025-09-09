# 🚀 NewsBoard - Startup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud connection)
- npm or yarn package manager

## 🔧 Setup & Installation

### 1. Install Dependencies

**Backend Setup:**
```bash
cd Backend
npm install
```

**Frontend Setup:**
```bash
cd ..
npm install
```

### 2. Environment Variables

**Backend (.env in Backend folder):**
```env
GNEWS_API_KEY=634c71d3a3b44539a03e33700e929183
MONGODB_URI=mongodb://localhost:27017/newsboard
SESSION_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env in root folder):**
```env
REACT_APP_WEATHER_API_KEY=2c8b5f7d1e9a3c4f6b8d0e2a4c6f8b0a
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3. Database Setup

**Start MongoDB:**
```bash
# Windows
mongod

# macOS/Linux
sudo service mongod start
```

## 🏃‍♂️ Running the Application

### Step 1: Start Backend Server
```bash
cd Backend
npm start
# or for development with auto-restart
npm run dev
```

**You should see:**
```
🚀 Server is running on http://localhost:5000
Connected to MongoDB
```

### Step 2: Start Frontend (in a new terminal)
```bash
cd todo-list-v2
npm start
```

**You should see:**
```
Compiled successfully!
Local:            http://localhost:3000
```

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🎯 Features Available

### ✅ Fixed Issues:
- **Shop:** 100+ products with working images
- **Weather:** Real-time weather with fallback data
- **Contact Form:** Fully functional with backend
- **Profile:** Complete user management
- **About Page:** Creator info visible
- **Home Page:** Logo visible with fallback news
- **UI Animations:** Comprehensive animation system
- **Responsive Design:** Mobile-friendly layout

### 🛍️ Shop Features:
- 100+ real products across 12+ categories
- Working cart system
- Product search and filtering
- Detailed product specifications
- Professional UI with animations

### 📱 Mobile Support:
- Responsive navbar
- Touch-friendly interface
- Optimized for all screen sizes

## 🐛 Troubleshooting

### Issue: Images not loading in shop
**Solution:** Images now use picsum.photos service - should work without issues.

### Issue: API calls failing
**Solution:** Make sure backend server is running on port 5000.

### Issue: Weather not showing
**Solution:** Weather has fallback data - will show mock weather if API fails.

### Issue: Profile not working
**Solution:** Make sure you're logged in and backend is running.

### Issue: Contact form not visible
**Solution:** Backend server must be running for form to work.

### Issue: News not loading
**Solution:** Fallback news is now available when backend is not running.

## 📝 Default Login Credentials

You can create new accounts via the signup page or use Google OAuth integration.

## 🔄 Development Workflow

1. **Backend Development:**
   ```bash
   cd Backend
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development:**
   ```bash
   npm start  # React development server
   ```

3. **Database Management:**
   - MongoDB Compass for GUI
   - Direct MongoDB shell for CLI

## 🌟 Key Components

- **Navbar:** Logo, navigation, weather, user menu
- **Shop:** Full e-commerce with 100+ products
- **Home:** Hero section, featured news, statistics
- **Profile:** User information management
- **Contact:** Professional contact form
- **About:** Creator information and features
- **Dashboard:** User analytics and quick actions

## 🎨 UI Features

- **Animations:** 50+ animation classes
- **Responsive:** Mobile-first design
- **Dark Mode:** Supported throughout
- **Accessibility:** WCAG compliant
- **Performance:** Optimized loading

## 📞 Support

If you encounter issues:
1. Check that both servers are running
2. Verify environment variables are set
3. Check browser console for errors
4. Ensure MongoDB is connected
5. Check network connectivity for external APIs

## 🚀 Production Deployment

For production deployment:
1. Build the React app: `npm run build`
2. Configure production environment variables
3. Use PM2 or similar for backend process management
4. Set up reverse proxy with nginx
5. Configure HTTPS certificates

---

**Enjoy your NewsBoard application! 🎉**
