import React, { useState, useEffect } from 'react';
import { Utensils, User, Scale, Activity, Heart, Sparkles, ArrowRight, Loader2, Download, RefreshCw } from 'lucide-react';

export default function DietPlanner() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [formData, setFormData] = useState({
    foodPreference: '',
    age: '',
    weight: '',
    height: '',
    healthHistory: '',
    bmi: '',
    apiKey: ''
  });

  // Calculate BMI automatically
  useEffect(() => {
    if (formData.weight && formData.height) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmi = (parseFloat(formData.weight) / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi: isNaN(bmi) ? '' : bmi }));
    }
  }, [formData.weight, formData.height]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDietPlan = async () => {
  

    setIsGenerating(true);

    const prompt = `Create a personalized diet plan based on the following information:

Food Preference: ${formData.foodPreference}
Age: ${formData.age} years
Weight: ${formData.weight} kg
Height: ${formData.height} cm
BMI: ${formData.bmi}
Health History: ${formData.healthHistory}

Please provide a comprehensive diet plan that includes:
1. Daily calorie target
2. Macronutrient breakdown (protein, carbs, fats)
3. Meal plan for 7 days with breakfast, lunch, dinner, and snacks
4. Nutritional guidelines specific to their health conditions
5. Hydration recommendations
6. Tips for success

Format the response in a clear, structured way with sections and bullet points.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDZwX6iaBWTnPFZUcmEHeumIIAaUlCJb7w`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setDietPlan(data.candidates[0].content.parts[0].text);
        setStep(3);
      } else {
        alert('Failed to generate diet plan. Please check your API key and try again.');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert('An error occurred while generating your diet plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = () => {
    const element = document.createElement('a');
    const file = new Blob([dietPlan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'my-diet-plan.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetPlanner = () => {
    setStep(1);
    setDietPlan(null);
    setFormData({
      foodPreference: '',
      age: '',
      weight: '',
      height: '',
      healthHistory: '',
      bmi: '',
      apiKey: ''
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'DM Sans', sans-serif;
          margin: 0;
        }
        
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ecfeff 100%);
          padding: 2rem;
        }
        
        .max-width-container {
          max-width: 900px;
          margin: 0 auto;
        }
        
        /* Header Styles */
        .header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeIn 0.6s ease-out;
        }
        
        .header-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .header-icon {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          padding: 0.75rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #065f46 0%, #0f766e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .header-subtitle {
          color: #6b7280;
          font-size: 1.125rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Progress Bar */
        .progress-container {
          margin-bottom: 2rem;
          animation: fadeIn 0.6s ease-out;
        }
        

        
    
        
        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .progress-label-active {
          font-weight: 600;
          color: #059669;
        }
        
        /* Card Styles */
        .card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
          animation: fadeIn 0.6s ease-out;
        }
        
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        /* Form Styles */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .form-grid-2col {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .form-group {
          animation: slideIn 0.5s ease-out;
        }
        
        .form-group-full {
          grid-column: 1 / -1;
        }
        
        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .label-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          background: white;
          font-size: 1rem;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          outline: none;
          border-color: #10b981;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
        }
        
        .input-field::placeholder {
          color: #9ca3af;
        }
        
        textarea.input-field {
          resize: vertical;
          min-height: 120px;
          font-family: 'DM Sans', sans-serif;
        }
        
        .input-readonly {
          background: #f9fafb;
          color: #374151;
          font-weight: 600;
          cursor: not-allowed;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #10b981;
        }
        
        /* Button Styles */
        .btn {
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 1.125rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          color: white;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          width: 100%;
          margin-top: 2rem;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
        }
        
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          flex: 1;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .btn-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-gray {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
        }
        
        .button-group {
          display: flex;
          gap: 1rem;
        }
        
        /* Info Cards */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .info-card {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #d1fae5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        
        .info-card-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        
        .info-card-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .health-history-card {
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #a7f3d0;
          margin-bottom: 2rem;
        }
        
        .health-history-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .health-history-text {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        
        /* Diet Plan Display */
        .diet-plan-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .diet-plan-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .diet-plan-icon {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          padding: 0.5rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .diet-plan-content-wrapper {
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%);
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #a7f3d0;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .diet-plan-content {
          color: #374151;
          line-height: 1.8;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        .api-key-help {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }
        
        .api-key-link {
          color: #059669;
          text-decoration: none;
        }
        
        .api-key-link:hover {
          text-decoration: underline;
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .app-container {
            padding: 1rem;
          }
          
          .header-title {
            font-size: 2rem;
          }
          
          .header-subtitle {
            font-size: 1rem;
          }
          
          .form-grid-2col {
            grid-template-columns: 1fr;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .diet-plan-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .action-buttons {
            width: 100%;
          }
          
          .btn-small {
            flex: 1;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="max-width-container">
          {/* Header */}
          <div className="header">
            <div className="header-icon-container">
              <div className="header-icon">
                <Utensils size={32} color="white" />
              </div>
              <h1 className="header-title">Meal Buddy</h1>
            </div>
            <p className="header-subtitle">
              Your personalized journey to healthier eating, powered by AI
            </p>
          </div>

          {/* Progress Bar */}
          {step < 3 && (
            <div className="progress-container">
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
              <div className="progress-labels">
                <span className={step === 1 ? 'progress-label-active' : ''}>Your Details</span>
                <span className={step === 2 ? 'progress-label-active' : ''}>Review & Generate</span>
              </div>
            </div>
          )}

          {/* Step 1: Form */}
          {step === 1 && (
            <div className="card">
              <h2 className="card-title">
                <User size={28} color="#059669" />
                Tell us about yourself
              </h2>

              <div className="form-grid form-grid-2col">
                {/* Food Preference */}
                <div className="form-group form-group-full" style={{ animationDelay: '0.1s' }}>
                  <label className="form-label">Food Preference</label>
                  <select
                    value={formData.foodPreference}
                    onChange={(e) => handleInputChange('foodPreference', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select your preference</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Pescatarian">Pescatarian</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                  </select>
                </div>

                {/* Age */}
                <div className="form-group" style={{ animationDelay: '0.2s' }}>
                  <label className="form-label">Age (years)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    className="input-field"
                  />
                </div>

                {/* Weight */}
                <div className="form-group" style={{ animationDelay: '0.3s' }}>
                  <label className="form-label label-with-icon">
                    <Scale size={16} />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70"
                    className="input-field"
                  />
                </div>

                {/* Height */}
                <div className="form-group" style={{ animationDelay: '0.4s' }}>
                  <label className="form-label label-with-icon">
                    <Activity size={16} />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="170"
                    className="input-field"
                  />
                </div>

                {/* BMI */}
                <div className="form-group" style={{ animationDelay: '0.5s' }}>
                  <label className="form-label">BMI Index</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      value={formData.bmi}
                      readOnly
                      placeholder="Auto-calculated"
                      className="input-field input-readonly"
                    />
                    {formData.bmi && (
                      <div className="input-icon">
                        <Sparkles size={20} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Health History */}
                <div className="form-group form-group-full" style={{ animationDelay: '0.6s' }}>
                  <label className="form-label label-with-icon">
                    <Heart size={16} />
                    Health History
                  </label>
                  <textarea
                    value={formData.healthHistory}
                    onChange={(e) => handleInputChange('healthHistory', e.target.value)}
                    placeholder="Please describe any medical conditions, allergies, dietary restrictions, or health goals..."
                    className="input-field"
                  />
                </div>
              </div>

                        <div className="button-group" style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={generateDietPlan}
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{ marginTop: 0 }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Diet Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

     

    
        

          {/* Step 3: Diet Plan Display */}
          {step === 3 && dietPlan && (
            <div className="card">
              <div className="diet-plan-header">
                <h2 className="diet-plan-title">
                  <div className="diet-plan-icon">
                    <Sparkles size={24} color="white" />
                  </div>
                  Your Personalized Diet Plan
                </h2>
                <div className="action-buttons">
                  <button
                    onClick={downloadPlan}
                    className="btn btn-small btn-blue"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={resetPlanner}
                    className="btn btn-small btn-gray"
                  >
                    <RefreshCw size={16} />
                    New Plan
                  </button>
                </div>
              </div>

              <div className="diet-plan-content-wrapper">
                <div className="diet-plan-content">
                  {dietPlan}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="info-card">
      <p className="info-card-label">{label}</p>
      <p className="info-card-value">{value}</p>
    </div>
  );
}