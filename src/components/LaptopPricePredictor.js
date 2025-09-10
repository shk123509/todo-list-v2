import React, { useState, useEffect } from 'react';
import './LaptopPricePredictor.css';

const LaptopPricePredictor = () => {
  const [formData, setFormData] = useState({
    brand: 'Dell',
    processor: 'Intel Core i5',
    ram: 8,
    storage: 512,
    storageType: 'SSD',
    graphics: 'Integrated',
    screenSize: 15.6,
    touchscreen: false,
    weight: 2.0,
    batteryLife: 8,
    operatingSystem: 'Windows 11'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [confidence, setConfidence] = useState(85);
  const [bulkPredictions, setBulkPredictions] = useState([]);

  // Laptop brands
  const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer', 'MSI', 'Microsoft', 'Razer', 'Samsung'];
  
  // Processors
  const processors = [
    'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9',
    'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9',
    'Apple M1', 'Apple M2', 'Apple M3'
  ];

  // Graphics cards
  const graphicsOptions = [
    'Integrated', 'NVIDIA GTX 1650', 'NVIDIA GTX 1660', 'NVIDIA RTX 3050',
    'NVIDIA RTX 3060', 'NVIDIA RTX 3070', 'NVIDIA RTX 3080', 'NVIDIA RTX 4060',
    'NVIDIA RTX 4070', 'NVIDIA RTX 4080', 'AMD Radeon RX 6600', 'AMD Radeon RX 7600'
  ];

  // ML Model simulation (In production, this would call a real ML API)
  const predictPrice = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Base price calculation
      let basePrice = 400;
      
      // Brand premium
      const brandPremium = {
        'Apple': 800,
        'Razer': 500,
        'Microsoft': 400,
        'Dell': 200,
        'HP': 100,
        'Lenovo': 100,
        'ASUS': 150,
        'MSI': 300,
        'Acer': 0,
        'Samsung': 200
      };
      
      basePrice += brandPremium[formData.brand] || 0;
      
      // Processor pricing
      const processorPrice = {
        'Intel Core i3': 0,
        'Intel Core i5': 200,
        'Intel Core i7': 400,
        'Intel Core i9': 800,
        'AMD Ryzen 3': 0,
        'AMD Ryzen 5': 180,
        'AMD Ryzen 7': 380,
        'AMD Ryzen 9': 750,
        'Apple M1': 300,
        'Apple M2': 500,
        'Apple M3': 700
      };
      
      basePrice += processorPrice[formData.processor] || 0;
      
      // RAM pricing (per GB)
      basePrice += formData.ram * 15;
      
      // Storage pricing
      if (formData.storageType === 'SSD') {
        basePrice += formData.storage * 0.08;
      } else {
        basePrice += formData.storage * 0.03;
      }
      
      // Graphics card pricing
      const graphicsPrice = {
        'Integrated': 0,
        'NVIDIA GTX 1650': 200,
        'NVIDIA GTX 1660': 250,
        'NVIDIA RTX 3050': 300,
        'NVIDIA RTX 3060': 450,
        'NVIDIA RTX 3070': 600,
        'NVIDIA RTX 3080': 900,
        'NVIDIA RTX 4060': 500,
        'NVIDIA RTX 4070': 800,
        'NVIDIA RTX 4080': 1200,
        'AMD Radeon RX 6600': 280,
        'AMD Radeon RX 7600': 350
      };
      
      basePrice += graphicsPrice[formData.graphics] || 0;
      
      // Screen size adjustment
      if (formData.screenSize > 15) {
        basePrice += (formData.screenSize - 15) * 50;
      }
      
      // Touchscreen
      if (formData.touchscreen) {
        basePrice += 150;
      }
      
      // Weight adjustment (lighter is more expensive)
      if (formData.weight < 1.5) {
        basePrice += 200;
      }
      
      // Battery life
      if (formData.batteryLife > 10) {
        basePrice += 100;
      }
      
      // Add some randomness for realism
      const variance = (Math.random() - 0.5) * 200;
      const finalPrice = Math.round(basePrice + variance);
      
      // Calculate confidence based on specifications
      let conf = 85;
      if (formData.brand === 'Apple') conf += 5;
      if (formData.ram >= 16) conf += 3;
      if (formData.storageType === 'SSD') conf += 2;
      conf = Math.min(95, conf + (Math.random() * 5 - 2.5));
      
      setPrediction(finalPrice);
      setConfidence(Math.round(conf));
      
      // Add to history
      setPriceHistory(prev => [...prev, {
        price: finalPrice,
        specs: { ...formData },
        timestamp: new Date().toLocaleTimeString()
      }].slice(-5)); // Keep last 5 predictions
      
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      brand: 'Dell',
      processor: 'Intel Core i5',
      ram: 8,
      storage: 512,
      storageType: 'SSD',
      graphics: 'Integrated',
      screenSize: 15.6,
      touchscreen: false,
      weight: 2.0,
      batteryLife: 8,
      operatingSystem: 'Windows 11'
    });
    setPrediction(null);
  };

  // CSV Upload Functions
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        parseCSV(text);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const laptop = {};
        headers.forEach((header, index) => {
          laptop[header] = values[index]?.trim();
        });
        data.push(laptop);
      }
    }
    
    predictBulkPrices(data);
  };

  const predictBulkPrices = (laptops) => {
    const predictions = laptops.map(laptop => {
      // Parse laptop specs from CSV
      const ram = parseInt(laptop.RAM) || 8;
      const storage = parseInt(laptop.Storage) || 512;
      
      // Calculate base price in INR
      let basePrice = 30000;
      basePrice += ram * 2000;
      basePrice += storage * 20;
      if (laptop.Processor?.includes('i7') || laptop.Processor?.includes('Ryzen 7')) basePrice += 15000;
      if (laptop.Processor?.includes('i9') || laptop.Processor?.includes('Ryzen 9')) basePrice += 30000;
      if (laptop.Graphics?.includes('RTX')) basePrice += 40000;
      if (laptop.Graphics?.includes('GTX')) basePrice += 20000;
      
      return {
        ...laptop,
        predictedPrice: basePrice
      };
    });
    
    setBulkPredictions(predictions);
  };

  const downloadPredictions = () => {
    if (bulkPredictions.length === 0) return;
    
    const csv = [
      [...Object.keys(bulkPredictions[0]), 'PredictedPrice'].join(','),
      ...bulkPredictions.map(row => 
        [...Object.values(row).slice(0, -1), row.predictedPrice].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laptop_price_predictions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Generate comparison data
  const getComparisonData = () => {
    if (!prediction) return [];
    
    return [
      { name: 'Your Config', price: prediction, color: '#667eea' },
      { name: 'Market Avg', price: prediction * 1.1, color: '#f093fb' },
      { name: 'Premium', price: prediction * 1.3, color: '#f5576c' },
      { name: 'Budget', price: prediction * 0.8, color: '#4facfe' }
    ];
  };

  return (
    <div className="laptop-predictor-container">
      {/* Background Animation */}
      <div className="predictor-bg">
        <div className="floating-laptop laptop-1">💻</div>
        <div className="floating-laptop laptop-2">🖥️</div>
        <div className="floating-laptop laptop-3">⌨️</div>
        <div className="circuit-pattern"></div>
      </div>

      <div className="predictor-content">
        <div className="predictor-header">
          <h1 className="predictor-title">
            <span className="gradient-text">Laptop Price Predictor</span>
            <span className="ml-badge">Powered by ML</span>
          </h1>
          <p className="predictor-subtitle">
            Get instant price predictions using our advanced machine learning model
          </p>
        </div>

        <div className="predictor-main">
          {/* CSV Upload Section - Top */}
          <div className="csv-upload-section">
            <h2 className="section-title">
              <span className="label-icon">📊</span>
              Bulk Prediction from CSV
            </h2>
            <div className="upload-area">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                id="csv-upload"
                className="csv-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="csv-upload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">Click to upload CSV file</span>
                <span className="upload-hint">Format: Brand, Processor, RAM, Storage, Graphics, etc.</span>
              </label>
            </div>
            
            {bulkPredictions.length > 0 && (
              <div className="bulk-results">
                <h3>Bulk Predictions ({bulkPredictions.length} laptops)</h3>
                <div className="bulk-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Brand</th>
                        <th>Processor</th>
                        <th>RAM</th>
                        <th>Storage</th>
                        <th>Predicted Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPredictions.slice(0, 5).map((laptop, idx) => (
                        <tr key={idx}>
                          <td>{laptop.Brand || 'N/A'}</td>
                          <td>{laptop.Processor || 'N/A'}</td>
                          <td>{laptop.RAM || 'N/A'}GB</td>
                          <td>{laptop.Storage || 'N/A'}GB</td>
                          <td>₹{laptop.predictedPrice?.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bulkPredictions.length > 5 && (
                    <p className="more-results">...and {bulkPredictions.length - 5} more</p>
                  )}
                </div>
                <button onClick={downloadPredictions} className="download-btn">
                  <span>📥</span> Download All Predictions
                </button>
              </div>
            )}
          </div>
          
          {/* Main Content Grid */}
          <div className="main-sections">
            {/* Left Side - Input Form */}
            <div className="input-section">
            <h2 className="section-title">Laptop Specifications</h2>
            
            <div className="spec-grid">
              {/* Brand Selection */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🏢</span>
                  Brand
                </label>
                <select 
                  name="brand" 
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Processor */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🎯</span>
                  Processor
                </label>
                <select 
                  name="processor" 
                  value={formData.processor}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {processors.map(proc => (
                    <option key={proc} value={proc}>{proc}</option>
                  ))}
                </select>
              </div>

              {/* RAM */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🧠</span>
                  RAM (GB)
                </label>
                <div className="slider-container">
                  <input 
                    type="range"
                    name="ram"
                    min="4"
                    max="64"
                    step="4"
                    value={formData.ram}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.ram} GB</span>
                </div>
              </div>

              {/* Storage */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">💾</span>
                  Storage
                </label>
                <div className="storage-input">
                  <input 
                    type="range"
                    name="storage"
                    min="128"
                    max="2048"
                    step="128"
                    value={formData.storage}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.storage} GB</span>
                  <select 
                    name="storageType"
                    value={formData.storageType}
                    onChange={handleInputChange}
                    className="storage-type"
                  >
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                  </select>
                </div>
              </div>

              {/* Graphics */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🎮</span>
                  Graphics Card
                </label>
                <select 
                  name="graphics" 
                  value={formData.graphics}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {graphicsOptions.map(gpu => (
                    <option key={gpu} value={gpu}>{gpu}</option>
                  ))}
                </select>
              </div>

              {/* Screen Size */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">📱</span>
                  Screen Size (inches)
                </label>
                <div className="slider-container">
                  <input 
                    type="range"
                    name="screenSize"
                    min="11"
                    max="17"
                    step="0.1"
                    value={formData.screenSize}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.screenSize}"</span>
                </div>
              </div>

              {/* Touchscreen */}
              <div className="spec-group">
                <label className="spec-label checkbox-label">
                  <input 
                    type="checkbox"
                    name="touchscreen"
                    checked={formData.touchscreen}
                    onChange={handleInputChange}
                    className="spec-checkbox"
                  />
                  <span className="checkbox-text">
                    <span className="label-icon">👆</span>
                    Touchscreen
                  </span>
                </label>
              </div>

              {/* Weight */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">⚖️</span>
                  Weight (kg)
                </label>
                <div className="slider-container">
                  <input 
                    type="range"
                    name="weight"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.weight} kg</span>
                </div>
              </div>

              {/* Battery Life */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🔋</span>
                  Battery Life (hours)
                </label>
                <div className="slider-container">
                  <input 
                    type="range"
                    name="batteryLife"
                    min="4"
                    max="20"
                    step="1"
                    value={formData.batteryLife}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.batteryLife} hrs</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={predictPrice}
                disabled={loading}
                className="predict-btn"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔮</span>
                    Predict Price
                  </>
                )}
              </button>
              <button onClick={resetForm} className="reset-btn">
                <span>🔄</span>
                Reset
              </button>
            </div>
            </div>

            {/* Right Side - Results */}
            <div className="results-section">
            {prediction && (
              <>
                <div className="prediction-card">
                  <h3 className="prediction-label">Predicted Price</h3>
                  <div className="price-display">
                    <span className="currency">₹</span>
                    <span className="price-value">{(prediction * 83).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="confidence-meter">
                    <div className="confidence-label">
                      Model Confidence: {confidence}%
                    </div>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="price-range">
                    <span className="range-label">Estimated Range:</span>
                    <span className="range-value">
                      ₹{(prediction * 0.9 * 83).toLocaleString('en-IN')} - ₹{(prediction * 1.1 * 83).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Price Comparison */}
                <div className="comparison-section">
                  <h3 className="section-subtitle">Market Comparison</h3>
                  <div className="comparison-bars">
                    {getComparisonData().map((item, index) => (
                      <div key={index} className="comparison-item">
                        <div className="bar-label">{item.name}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${(item.price / (prediction * 1.5)) * 100}%`,
                              background: item.color
                            }}
                          >
                            <span className="bar-value">₹{Math.round(item.price * 83).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="recommendations">
                  <h3 className="section-subtitle">💡 Recommendations</h3>
                  <div className="recommendation-cards">
                    <div className="rec-card">
                      <span className="rec-icon">💰</span>
                      <div className="rec-content">
                        <h4>Best Time to Buy</h4>
                        <p>Consider buying during Black Friday or back-to-school sales for 15-20% discount</p>
                      </div>
                    </div>
                    <div className="rec-card">
                      <span className="rec-icon">⚡</span>
                      <div className="rec-content">
                        <h4>Performance Tip</h4>
                        <p>{formData.ram < 16 ? 'Consider upgrading to 16GB RAM for better multitasking' : 'Your RAM configuration is excellent for most tasks'}</p>
                      </div>
                    </div>
                    <div className="rec-card">
                      <span className="rec-icon">🎯</span>
                      <div className="rec-content">
                        <h4>Alternative</h4>
                        <p>Similar specs in {formData.brand === 'Apple' ? 'Windows laptops' : 'other brands'} could save you ₹{Math.round(prediction * 0.15 * 83).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Prediction History */}
            {priceHistory.length > 0 && (
              <div className="history-section">
                <h3 className="section-subtitle">Recent Predictions</h3>
                <div className="history-list">
                  {priceHistory.map((item, index) => (
                    <div key={index} className="history-item">
                      <span className="history-time">{item.timestamp}</span>
                      <span className="history-specs">
                        {item.specs.brand} • {item.specs.processor} • {item.specs.ram}GB RAM
                      </span>
                      <span className="history-price">₹{(item.price * 83).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div> {/* End of main-sections */}
        </div> {/* End of predictor-main */}
      </div>
    </div>
  );
};

export default LaptopPricePredictor;
