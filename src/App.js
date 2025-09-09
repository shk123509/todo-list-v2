import React from 'react';
import './animations.css';
import './globalFixes.css';
import './globalUIFixes.css';
import './utils/scrollAnimations.js';
// TEMP: ensure visibility while we stabilize animations
import './emergencyFix.css';
// import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import News from './components/News';
import About from './components/About';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import UserPreferences from './components/UserPreferences';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import SearchNews from './components/SearchNews';
import Trending from './components/Trending';
import UltraModernDashboard from './components/UltraModernDashboard';
import AuthSuccess from './components/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import Shop from './components/Shop';
import ScrollToTop from './components/ScrollToTop';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';



const AppContent = () => {
  const [progress, setProgress] = React.useState(0);
  // Auth status is now checked in AuthContext's useEffect

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Navbar />
        <LoadingBar height={3} color="#f11946" progress={progress} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/NewsMonkey" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="sports" /></ProtectedRoute>} />
          <Route path="/entertainment" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="entertainment" /></ProtectedRoute>} />
          <Route path="/business" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="business" /></ProtectedRoute>} />
          <Route path="/general" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="general" /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="health" /></ProtectedRoute>} />
          <Route path="/science" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="science" /></ProtectedRoute>} />
          <Route path="/technology" element={<ProtectedRoute><News setProgress={setProgress} pageSize={6} country="in" category="technology" /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchNews /></ProtectedRoute>} />
          <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UltraModernDashboard /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><UserPreferences /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        </Routes>
        
        {/* Global Components */}
        <ChatBot />
        <ScrollToTop />
      </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;


// // import './App.css';
// // import React, { Component } from 'react';
// // import Navbar from './components/Navbar';
// // import News from './components/News';
// // import About from './components/About';
// // import Home from './components/Home';
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import LoadingBar from 'react-top-loading-bar';
// // import Login from './components/Login';
// // import Signup from './components/Signup';

// // export default class App extends Component {
// //   state = {
// //     progress: 0
// //   }

// //   setProgress = (progress) => {
// //     this.setState({ progress: progress });
// //   }

// //   render() {
// //     return (
// //       <Router>
// //         <Navbar />
// //         <LoadingBar height={3} color="#f11946" progress={this.state.progress} />
// //         <Routes>
// //           {/* Home page route */}
// //           <Route path="/" element={<Home />} />
// //           <Route path="/NewsMonkey" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="sports" />} />
// //           <Route path="/entertainment" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="entertainment" />} />
// //           <Route path="/business" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="business" />} />
// //           <Route path="/general" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="general" />} />
// //           <Route path="/health" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="health" />} />
// //           <Route path="/science" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="science" />} />
// //           <Route path="/technology" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="technology" />} />
// //           {/* About page route */}
// //           <Route path="/about" element={<About />} />
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/signup" element={<Signup />} />
// //         </Routes>
// //       </Router>
// //     )
// //   }
// // }





// export default class App extends Component {
//   state = {
//     progress: 0
//   };

//   setProgress = (progress) => {
//     this.setState({ progress });
//   };

//   render() {
//     return (
//       <Router>
//         <Navbar />
//         <LoadingBar
//           height={3}
//           color="#f11946"
//           progress={this.state.progress}
//         />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/NewsMonkey" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="sports" />} />
//           <Route path="/entertainment" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="entertainment" />} />
//           <Route path="/business" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="business" />} />
//           <Route path="/general" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="general" />} />
//           <Route path="/health" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="health" />} />
//           <Route path="/science" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="science" />} />
//           <Route path="/technology" element={<News setProgress={this.setProgress} pageSize={6} country="in" category="technology" />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Routes>
//       </Router>
//     );
//   }
// }
