import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import weatherService from '../services/weatherService';
import './ChatBot.css';

const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name || 'there'}! I'm Jarvis, your intelligent news assistant. I can help you find news, summarize articles, answer questions, and much more. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for global ChatBot toggle events
    const handleToggleChatBot = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleChatBot', handleToggleChatBot);
    
    return () => {
      window.removeEventListener('toggleChatBot', handleToggleChatBot);
    };
  }, []);

  // Get real weather data
  const getWeatherData = async (city) => {
    try {
      const weather = await weatherService.getCurrentWeather(city);
      return weather;
    } catch (error) {
      console.error('Weather service error:', error);
      // Return fallback data
      return weatherService.getMockWeatherData(city || 'Mumbai');
    }
  };

  // Get weather forecast
  const getWeatherForecast = async (city) => {
    try {
      const forecast = await weatherService.getForecast(city);
      return forecast;
    } catch (error) {
      console.error('Forecast service error:', error);
      return weatherService.getMockForecastData(city || 'Mumbai');
    }
  };

  // Get current location weather
  const getCurrentLocationWeather = async () => {
    try {
      const weather = await weatherService.getCurrentLocationWeather();
      return weather;
    } catch (error) {
      console.error('Location weather error:', error);
      return weatherService.getMockWeatherData('Your Location');
    }
  };

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process the message with AI
      const response = await processMessageWithAI(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const processMessageWithAI = async (message) => {
    const lowerMessage = message.toLowerCase();

    // Weather-related commands
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      try {
        let weatherData;
        
        // Check if user asked for specific city weather
        const cities = weatherService.extractCitiesFromQuery(message);
        const requestedCity = cities[0];
        
        // Check for current location request
        if (lowerMessage.includes('my location') || lowerMessage.includes('current location') || lowerMessage.includes('here')) {
          weatherData = await getCurrentLocationWeather();
        } else if (requestedCity && requestedCity !== 'Mumbai') {
          weatherData = await getWeatherData(requestedCity);
        } else {
          weatherData = await getWeatherData('Mumbai');
        }
        
        // Check if user wants forecast
        if (lowerMessage.includes('forecast') || lowerMessage.includes('week') || lowerMessage.includes('days')) {
          const forecastData = await getWeatherForecast(weatherData.location.split(',')[0]);
          return weatherService.formatForecastForChat(forecastData);
        }
        
        return weatherService.formatWeatherForChat(weatherData);
      } catch (error) {
        console.error('Weather processing error:', error);
        return "I'm having trouble getting weather data right now. You can find weather-related news in our Science section!";
      }
    }

    // Music-related commands
    if (lowerMessage.includes('music') || lowerMessage.includes('song') || lowerMessage.includes('play')) {
      const musicSuggestions = [
        "🎵 Here are some music recommendations:\n\n• Spotify Premium - Available in our Shop\n• Latest music news in Entertainment section\n• Trending songs: 'Anti-Hero' by Taylor Swift\n• 'Flowers' by Miley Cyrus\n\nCheck out our Shop for music subscriptions!",
        "🎶 Music time! You can:\n\n• Browse music products in our Shop\n• Read music industry news\n• Find concert announcements\n• Discover new artists in Entertainment\n\nWhat type of music interests you?"
      ];
      return musicSuggestions[Math.floor(Math.random() * musicSuggestions.length)];
    }

    // Shopping-related commands
    if (lowerMessage.includes('shop') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return "🛍️ Welcome to NewsBoard Shop! We have amazing products for developers and tech enthusiasts:\n\n• Latest MacBooks & Electronics\n• Programming Books & Courses\n• Developer Merchandise\n• Software & Subscriptions\n\nVisit our Shop section to explore all products!";
    }

    // News-related commands
    if (lowerMessage.includes('news') || lowerMessage.includes('headlines')) {
      if (lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
        return "I can help you find the latest technology news! You can visit the Technology section or search for specific tech topics. Would you like me to show you trending tech stories?";
      } else if (lowerMessage.includes('business')) {
        return "Looking for business news? I can direct you to our Business section with the latest market updates, company news, and economic insights.";
      } else {
        return "I can help you find news on any topic! Try visiting our main news sections: Technology, Business, Health, Entertainment, or Sports. You can also use our search feature to find specific articles.";
      }
    }

    // Bookmark-related commands
    if (lowerMessage.includes('bookmark') || lowerMessage.includes('save')) {
      return "You can bookmark any article by clicking the bookmark icon on news cards. All your saved articles will be available in your Bookmarks section where you can organize and manage them.";
    }

    // Search-related commands
    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      return "You can search for specific news topics using our Smart Search feature. Just use the search bar or visit the Search page to filter by category, date, and relevance.";
    }

    // Profile-related commands
    if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
      return "You can manage your profile, change your password, and update preferences in the Profile section. There you can also see your reading statistics and activity.";
    }

    // Trending-related commands
    if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
      return "Check out our Trending section to see what's popular right now! I analyze current topics and show you the most discussed stories across different categories.";
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I'm here to help! Here's what I can assist you with:\\n\\n• Find news articles on any topic\\n• Help you bookmark and organize articles\\n• Explain how to use NewsBoard features\\n• Answer questions about current events\\n• Provide personalized news recommendations\\n\\nJust ask me anything!";
    }

    // Weather (simulated)
    if (lowerMessage.includes('weather')) {
      return "While I don't have real-time weather data, I can help you find weather-related news and climate stories in our news sections. For current weather, I recommend checking a dedicated weather service.";
    }

    // Time
    if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Stay updated with the latest news throughout the day!`;
    }

    // Default intelligent response
    const responses = [
      "That's an interesting question! While I don't have specific information about that topic right now, you might find relevant articles in our news sections.",
      "I understand you're looking for information about that. Try using our search feature to find the most recent articles on this topic.",
      "Great question! I'm constantly learning and improving. For the most current information, I recommend checking our latest news sections.",
      "I appreciate your inquiry! You can explore our different news categories or use the search function to find specific information you're looking for."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickCommands = [
    { text: "Show me trending news", icon: "🔥" },
    { text: "What's the weather today?", icon: "🌤️" },
    { text: "Find technology articles", icon: "💻" },
    { text: "Weather forecast this week", icon: "🌦️" },
    { text: "How do I bookmark articles?", icon: "📖" },
    { text: "What's new today?", icon: "📰" }
  ];

  return (
    <>
      {/* Chat Button */}
      <div 
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
        <div className="pulse-ring"></div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div className="chat-info">
              <h4>Jarvis AI Assistant</h4>
              <span className="online-status">Online</span>
            </div>
            <button className="chat-minimize" onClick={() => setIsOpen(false)}>
              ➖
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                {message.sender === 'bot' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="message-avatar user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          <div className="quick-commands">
            {quickCommands.map((command, index) => (
              <button
                key={index}
                className="quick-command"
                onClick={() => setInputMessage(command.text)}
              >
                <span className="command-icon">{command.icon}</span>
                <span className="command-text">{command.text}</span>
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div className="chat-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about news..."
                className="chat-input"
                disabled={isTyping}
              />
              <button
                type="button"
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={isTyping || isListening}
              >
                {isListening ? '🎤' : '🎙️'}
              </button>
              <button
                type="submit"
                className="send-button"
                disabled={!inputMessage.trim() || isTyping}
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
