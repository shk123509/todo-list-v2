import React, { useState } from 'react';
import './HousingPricePredictor.css';

const HousingPricePredictor = () => {
  const [formData, setFormData] = useState({
    location: 'Mumbai',
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    floors: 1,
    yearBuilt: 2020,
    parking: 1,
    furnished: 'Semi-Furnished',
    propertyType: 'Apartment',
    facing: 'East',
    balconies: 1,
    amenities: []
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [bulkPredictions, setBulkPredictions] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Location options
  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
    'Kolkata', 'Pune', 'Ahmedabad', 'Gurgaon', 'Noida'
  ];

  // Property types
  const propertyTypes = ['Apartment', 'Villa', 'Independent House', 'Studio', 'Penthouse', 'Row House'];
  
  // Furnishing options
  const furnishingOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  
  // Facing directions
  const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
  
  // Amenities
  const amenitiesOptions = [
    'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Lift', 
    'Club House', 'Garden', 'Play Area', 'Parking', 'Water Supply'
  ];

  // ML Model simulation for housing price
  const predictPrice = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Base price calculation in INR
      let basePrice = 2000000; // 20 Lakhs base
      
      // Location multiplier
      const locationMultiplier = {
        'Mumbai': 3.5,
        'Delhi': 2.8,
        'Bangalore': 2.5,
        'Hyderabad': 2.0,
        'Chennai': 1.8,
        'Kolkata': 1.5,
        'Pune': 2.2,
        'Ahmedabad': 1.6,
        'Gurgaon': 2.6,
        'Noida': 2.3
      };
      
      basePrice *= locationMultiplier[formData.location] || 1.5;
      
      // Area pricing (per sq ft)
      const perSqFtPrice = {
        'Mumbai': 15000,
        'Delhi': 12000,
        'Bangalore': 8000,
        'Hyderabad': 6000,
        'Chennai': 5500,
        'Kolkata': 4500,
        'Pune': 7000,
        'Ahmedabad': 4000,
        'Gurgaon': 9000,
        'Noida': 7500
      };
      
      basePrice = (perSqFtPrice[formData.location] || 5000) * formData.area;
      
      // Property type adjustment
      const propertyMultiplier = {
        'Apartment': 1.0,
        'Villa': 1.5,
        'Independent House': 1.3,
        'Studio': 0.8,
        'Penthouse': 2.0,
        'Row House': 1.2
      };
      
      basePrice *= propertyMultiplier[formData.propertyType] || 1.0;
      
      // Bedrooms
      basePrice += formData.bedrooms * 500000;
      
      // Bathrooms
      basePrice += formData.bathrooms * 200000;
      
      // Year built (newer is more expensive)
      const age = 2024 - formData.yearBuilt;
      if (age < 5) basePrice *= 1.1;
      else if (age > 20) basePrice *= 0.85;
      
      // Furnishing
      if (formData.furnished === 'Furnished') basePrice += 1000000;
      else if (formData.furnished === 'Semi-Furnished') basePrice += 500000;
      
      // Parking
      basePrice += formData.parking * 300000;
      
      // Balconies
      basePrice += formData.balconies * 150000;
      
      // Amenities
      basePrice += formData.amenities.length * 100000;
      
      // Facing adjustment
      if (['North', 'East', 'North-East'].includes(formData.facing)) {
        basePrice *= 1.05;
      }
      
      // Add some variance
      const variance = (Math.random() - 0.5) * 0.1 * basePrice;
      const finalPrice = Math.round(basePrice + variance);
      
      // Calculate confidence
      let conf = 82;
      if (formData.area > 1000 && formData.area < 2000) conf += 5;
      if (formData.amenities.length > 5) conf += 3;
      if (['Mumbai', 'Delhi', 'Bangalore'].includes(formData.location)) conf += 5;
      conf = Math.min(95, conf + Math.random() * 5);
      
      setPrediction(finalPrice);
      setConfidence(Math.round(conf));
      setShowAnalysis(true);
      
      // Add to history
      setPriceHistory(prev => [...prev, {
        price: finalPrice,
        specs: { ...formData },
        timestamp: new Date().toLocaleTimeString()
      }].slice(-5));
      
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

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetForm = () => {
    setFormData({
      location: 'Mumbai',
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      floors: 1,
      yearBuilt: 2020,
      parking: 1,
      furnished: 'Semi-Furnished',
      propertyType: 'Apartment',
      facing: 'East',
      balconies: 1,
      amenities: []
    });
    setPrediction(null);
    setShowAnalysis(false);
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
        const property = {};
        headers.forEach((header, index) => {
          property[header] = values[index]?.trim();
        });
        data.push(property);
      }
    }
    
    predictBulkPrices(data);
  };

  const predictBulkPrices = (properties) => {
    const predictions = properties.map(property => {
      const area = parseFloat(property.Area) || 1200;
      const location = property.Location || 'Mumbai';
      const bedrooms = parseInt(property.Bedrooms) || 2;
      
      // Simplified bulk prediction
      const perSqFtPrice = {
        'Mumbai': 15000,
        'Delhi': 12000,
        'Bangalore': 8000,
        'Hyderabad': 6000,
        'Chennai': 5500,
        'Pune': 7000,
        'Gurgaon': 9000,
        'Noida': 7500
      };
      
      let price = (perSqFtPrice[location] || 5000) * area;
      price += bedrooms * 500000;
      
      return {
        ...property,
        predictedPrice: Math.round(price)
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
    a.download = 'housing_price_predictions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Format price in Indian format
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="housing-predictor-container">
      {/* Background */}
      <div className="predictor-bg">
        <div className="floating-house house-1">🏠</div>
        <div className="floating-house house-2">🏢</div>
        <div className="floating-house house-3">🏘️</div>
        <div className="building-pattern"></div>
      </div>

      <div className="predictor-content">
        {/* Header */}
        <div className="predictor-header">
          <h1 className="predictor-title">
            <span className="gradient-text">Housing Price Predictor</span>
            <span className="ml-badge">AI-Powered</span>
          </h1>
          <p className="predictor-subtitle">
            Get accurate property valuations using machine learning
          </p>
        </div>

        <div className="predictor-main">
          {/* CSV Upload Section */}
          <div className="csv-upload-section">
            <h2 className="section-title">
              <span className="label-icon">📊</span>
              Bulk Property Valuation
            </h2>
            <div className="upload-area">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                id="housing-csv-upload"
                className="csv-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="housing-csv-upload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">Upload Property CSV</span>
                <span className="upload-hint">Format: Location, Area, Bedrooms, Type, etc.</span>
              </label>
            </div>
            
            {bulkPredictions.length > 0 && (
              <div className="bulk-results">
                <h3>Bulk Valuations ({bulkPredictions.length} properties)</h3>
                <div className="bulk-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Area (sq ft)</th>
                        <th>Bedrooms</th>
                        <th>Type</th>
                        <th>Predicted Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkPredictions.slice(0, 5).map((property, idx) => (
                        <tr key={idx}>
                          <td>{property.Location || 'N/A'}</td>
                          <td>{property.Area || 'N/A'}</td>
                          <td>{property.Bedrooms || 'N/A'}</td>
                          <td>{property.Type || 'N/A'}</td>
                          <td>{formatPrice(property.predictedPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bulkPredictions.length > 5 && (
                    <p className="more-results">...and {bulkPredictions.length - 5} more</p>
                  )}
                </div>
                <button onClick={downloadPredictions} className="download-btn">
                  <span>📥</span> Download Valuations
                </button>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="input-section">
            <h2 className="section-title">Property Details</h2>
            
            <div className="spec-grid">
              {/* Location */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">📍</span>
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🏠</span>
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">📐</span>
                  Area (sq ft): {formData.area}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="area"
                    min="300"
                    max="5000"
                    step="50"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.area} sq ft</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🛏️</span>
                  Bedrooms: {formData.bedrooms}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="bedrooms"
                    min="1"
                    max="6"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.bedrooms} BHK</span>
                </div>
              </div>

              {/* Bathrooms */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🚿</span>
                  Bathrooms: {formData.bathrooms}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="bathrooms"
                    min="1"
                    max="5"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.bathrooms}</span>
                </div>
              </div>

              {/* Year Built */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">📅</span>
                  Year Built: {formData.yearBuilt}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="yearBuilt"
                    min="1990"
                    max="2024"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.yearBuilt}</span>
                </div>
              </div>

              {/* Furnishing */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🪑</span>
                  Furnishing
                </label>
                <select
                  name="furnished"
                  value={formData.furnished}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {furnishingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Facing */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🧭</span>
                  Facing
                </label>
                <select
                  name="facing"
                  value={formData.facing}
                  onChange={handleInputChange}
                  className="spec-select"
                >
                  {facingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Parking */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🚗</span>
                  Parking Spaces: {formData.parking}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="parking"
                    min="0"
                    max="4"
                    value={formData.parking}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.parking}</span>
                </div>
              </div>

              {/* Balconies */}
              <div className="spec-group">
                <label className="spec-label">
                  <span className="label-icon">🏛️</span>
                  Balconies: {formData.balconies}
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="balconies"
                    min="0"
                    max="4"
                    value={formData.balconies}
                    onChange={handleInputChange}
                    className="spec-slider"
                  />
                  <span className="slider-value">{formData.balconies}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h3 className="amenities-title">
                <span className="label-icon">✨</span>
                Amenities
              </h3>
              <div className="amenities-grid">
                {amenitiesOptions.map(amenity => (
                  <label key={amenity} className="amenity-item">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="amenity-checkbox"
                    />
                    <span className="amenity-label">{amenity}</span>
                  </label>
                ))}
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
                    <div className="loading-spinner"></div>
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

          {/* Results Section */}
          {prediction && (
            <div className="results-section">
              {/* Main Prediction */}
              <div className="prediction-card">
                <div className="prediction-label">Estimated Property Value</div>
                <div className="price-display">
                  <span className="price-value">{formatPrice(prediction)}</span>
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
                  <div className="range-item">
                    <span className="range-label">Min Estimate</span>
                    <span className="range-value">{formatPrice(prediction * 0.9)}</span>
                  </div>
                  <div className="range-item">
                    <span className="range-label">Max Estimate</span>
                    <span className="range-value">{formatPrice(prediction * 1.1)}</span>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              {showAnalysis && (
                <div className="analysis-section">
                  <h3 className="section-subtitle">Market Analysis</h3>
                  <div className="analysis-grid">
                    <div className="analysis-card">
                      <span className="analysis-icon">📊</span>
                      <span className="analysis-label">Per Sq Ft Price</span>
                      <span className="analysis-value">
                        ₹{Math.round(prediction / formData.area).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="analysis-card">
                      <span className="analysis-icon">📈</span>
                      <span className="analysis-label">Market Trend</span>
                      <span className="analysis-value trend-up">+8.5%</span>
                    </div>
                    <div className="analysis-card">
                      <span className="analysis-icon">🏘️</span>
                      <span className="analysis-label">Area Demand</span>
                      <span className="analysis-value">High</span>
                    </div>
                    <div className="analysis-card">
                      <span className="analysis-icon">⏱️</span>
                      <span className="analysis-label">Avg Selling Time</span>
                      <span className="analysis-value">45 days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price History */}
              {priceHistory.length > 0 && (
                <div className="history-section">
                  <h3 className="section-subtitle">Recent Predictions</h3>
                  <div className="history-list">
                    {priceHistory.map((item, idx) => (
                      <div key={idx} className="history-item">
                        <span className="history-time">{item.timestamp}</span>
                        <span className="history-specs">
                          {item.specs.location} • {item.specs.area} sq ft • {item.specs.bedrooms} BHK
                        </span>
                        <span className="history-price">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HousingPricePredictor;
