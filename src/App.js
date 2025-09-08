import React from 'react';
// import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import News from './components/News';
import About from './components/About';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';



const App = () => {
  const [progress, setProgress] = React.useState(0);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <LoadingBar height={3} color="#f11946" progress={progress} />
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />
          <Route path="/NewsMonkey" element={<News setProgress={setProgress} pageSize={6} country="in" category="sports" />} />
          <Route path="/entertainment" element={<News setProgress={setProgress} pageSize={6} country="in" category="entertainment" />} />
          <Route path="/business" element={<News setProgress={setProgress} pageSize={6} country="in" category="business" />} />
          <Route path="/general" element={<News setProgress={setProgress} pageSize={6} country="in" category="general" />} />
          <Route path="/health" element={<News setProgress={setProgress} pageSize={6} country="in" category="health" />} />
          <Route path="/science" element={<News setProgress={setProgress} pageSize={6} country="in" category="science" />} />
          <Route path="/technology" element={<News setProgress={setProgress} pageSize={6} country="in" category="technology" />} />
          {/* About page route */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
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
