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

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      const greetings = [
        `Hello ${user?.name || 'there'}! How can I assist you today? 😊`,
        `Hi! I'm Jarvis, your AI assistant. What would you like to know?`,
        `Greetings! Ready to help with news, weather, or any questions you have!`,
        `Hello! I can help you with news, answer questions, or just chat. What's on your mind?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Farewell
    if (lowerMessage.match(/^(bye|goodbye|see you|farewell|exit|quit)/)) {
      return `Goodbye ${user?.name || ''}! Feel free to come back anytime. Have a great day! 👋`;
    }

    // Thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! I'm always here to help. Is there anything else you'd like to know? 😊";
    }

    // Math calculations
    if (lowerMessage.includes('calculate') || lowerMessage.includes('what is') && /\d/.test(message)) {
      try {
        // Simple math expression evaluation
        const mathExpression = message.match(/[\d+\-*/\s()]+/g);
        if (mathExpression) {
          const expr = mathExpression[0].trim();
          // Safe evaluation of simple math
          const result = Function('"use strict"; return (' + expr + ')')();
          return `The answer is: ${result} 🧮`;
        }
      } catch (error) {
        return "I can help with simple math calculations. Try asking something like 'What is 25 + 37?' or 'Calculate 150 * 3'";
      }
    }

    // Programming questions
    if (lowerMessage.includes('programming') || lowerMessage.includes('coding') || lowerMessage.includes('javascript') || lowerMessage.includes('python')) {
      const programmingResponses = [
        "I can help with programming concepts! We have great programming books and courses in our Shop section. What specific language or concept interests you?",
        "Programming is fascinating! Whether you're into JavaScript, Python, or any other language, I can point you to resources. Check our Technology news for latest dev trends!",
        "As an AI, I love discussing code! Visit our Shop for programming books, or ask me about specific programming concepts you'd like to understand."
      ];
      return programmingResponses[Math.floor(Math.random() * programmingResponses.length)];
    }

    // General knowledge questions
    if (lowerMessage.includes('what is') || lowerMessage.includes('who is') || lowerMessage.includes('define')) {
      const knowledgeResponses = [
        `That's a great question! While I'm specialized in news and this platform's features, I can help you find articles about ${message.replace(/what is|who is|define/gi, '').trim()}. Try searching in our news sections!`,
        `Interesting topic! You might find detailed information about this in our news articles. Use the search feature to explore ${message.replace(/what is|who is|define/gi, '').trim()}.`,
        `I'd love to help you learn more about that! Check our various news categories or use the search function to find articles related to ${message.replace(/what is|who is|define/gi, '').trim()}.`
      ];
      return knowledgeResponses[Math.floor(Math.random() * knowledgeResponses.length)];
    }

    // Jokes
    if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      const jokes = [
        "Why don't programmers like nature? It has too many bugs! 🐛",
        "Why did the developer go broke? Because he used up all his cache! 💸",
        "How do robots eat guacamole? With computer chips! 🤖",
        "Why do programmers prefer dark mode? Because light attracts bugs! 🌙"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Personal questions about the bot
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
      return "I'm Jarvis, your AI assistant! I'm here to help you navigate NewsBoard, find interesting articles, answer questions, and make your experience enjoyable. Think of me as your intelligent companion! 🤖✨";
    }

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

    // Life advice
    if (lowerMessage.includes('advice') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      const advice = [
        "Based on what you're asking, I'd suggest exploring our diverse news categories to stay informed. Knowledge is power! 💪",
        "My advice: Stay curious, read diverse perspectives, and never stop learning. Our news platform is perfect for that!",
        "I recommend checking our Trending section to see what's important right now, then diving deeper into topics that interest you."
      ];
      return advice[Math.floor(Math.random() * advice.length)];
    }

    // Fun facts
    if (lowerMessage.includes('fact') || lowerMessage.includes('did you know')) {
      const facts = [
        "Did you know? The first computer bug was an actual bug - a moth trapped in Harvard's Mark II computer in 1947! 🦋",
        "Fun fact: There are more possible iterations of a chess game than atoms in the observable universe! ♟️",
        "Interesting fact: The @ symbol is about 500 years old and was used by merchants before email existed! 📧",
        "Did you know? The first website ever created is still online at info.cern.ch! 🌐"
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }

    // Games and entertainment
    if (lowerMessage.includes('game') || lowerMessage.includes('play') || lowerMessage.includes('bored')) {
      return "Feeling bored? Try these:\n\n🎮 Visit our Shop for gaming products\n📰 Play 'News Detective' - guess the news category from headlines\n🔍 Challenge yourself with our Search feature\n🎯 Set a goal to read 5 articles from different categories today!\n\nWant me to recommend some interesting articles?";
    }

    // Health and wellness
    if (lowerMessage.includes('health') || lowerMessage.includes('fitness') || lowerMessage.includes('wellness')) {
      return "Health is wealth! 🏃‍♂️ Check out our Health news section for the latest wellness tips, medical breakthroughs, and fitness trends. We also have health products in our Shop!";
    }

    // Food and recipes
    if (lowerMessage.includes('food') || lowerMessage.includes('recipe') || lowerMessage.includes('hungry')) {
      return "Feeling hungry? 🍕 While I can't cook, I can suggest checking our Shop for food-related products, or search for food news in our Entertainment section. Bon appétit!";
    }

    // Movies and TV
    if (lowerMessage.includes('movie') || lowerMessage.includes('film') || lowerMessage.includes('tv show')) {
      return "🎬 Love movies? Check our Entertainment section for the latest film news, reviews, and celebrity updates. You might also find streaming service deals in our Shop!";
    }

    // Sports
    if (lowerMessage.includes('sport') || lowerMessage.includes('football') || lowerMessage.includes('cricket')) {
      return "⚽ Sports fan? Our Sports section has all the latest scores, player news, and match analysis. Don't miss today's top sports headlines!";
    }

    // Technology help
    if (lowerMessage.includes('computer') || lowerMessage.includes('phone') || lowerMessage.includes('device')) {
      return "📱 Need tech help? Check our Technology news for tips and tricks, or browse our Shop for the latest gadgets and accessories!";
    }

    // AI and machine learning
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning')) {
      return "🤖 AI is fascinating! I'm powered by AI myself. Check our Technology section for the latest AI breakthroughs and developments. The future is here!";
    }

    // Default intelligent response with more variety
    const responses = [
      `That's an interesting topic! Let me help you explore "${message.substring(0, 50)}..." - try searching for it in our news sections for the latest information.`,
      `I appreciate your question about that! While I'm learning every day, you might find great insights in our news articles. Would you like me to help you search?`,
      `Fascinating question! 🤔 Our platform has diverse content that might cover this. Try browsing different categories or using the search feature.`,
      `Great question! I'm here to help you navigate NewsBoard and answer questions. For specific topics, our search feature is incredibly powerful!`,
      `Interesting! While I focus on helping with NewsBoard features, I'd love to help you find relevant articles. What category might this fall under?`,
      `That's thought-provoking! 💭 Let's explore this together - you can search for related articles or browse our various news categories.`
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
