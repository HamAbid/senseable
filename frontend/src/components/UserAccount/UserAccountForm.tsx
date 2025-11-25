import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { AccessibilityNeed, ReadingLevel, ComplexityLevel } from '../../types';
import { getColorPalette } from '../../utils/colorPalettes';
import Button from '../Common/Button';

interface UserAccountFormProps {
  isLoginMode?: boolean;
}

const UserAccountForm: React.FC<UserAccountFormProps> = ({ isLoginMode = false }) => {
  const { user, preferences, setUser, setPreferences } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    accessibilityNeed: preferences?.accessibility_need || 'none' as AccessibilityNeed,
    readingLevel: preferences?.reading_level || 'intermediate' as ReadingLevel,
    preferredComplexity: preferences?.preferred_complexity || 'moderate' as ComplexityLevel,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
    if (preferences) {
      setFormData(prev => ({
        ...prev,
        accessibilityNeed: preferences.accessibility_need,
        readingLevel: preferences.reading_level,
        preferredComplexity: preferences.preferred_complexity,
      }));
    }
  }, [user, preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== SUBMIT STARTED ===');
    console.log('Current user state:', user);
    console.log('Form data:', formData);

    try {
      if (!user) {
        console.log('=== NEW USER REGISTRATION PATH ===');
        // Register new user
        console.log('Step 1: Calling register API with:', { email: formData.email, name: formData.name });
        
        const newUser = await userService.register(
          formData.email,
          formData.name
        );
        
        console.log('Step 2: Register API returned:', newUser);
        console.log('Step 2a: newUser type:', typeof newUser);
        console.log('Step 2b: newUser keys:', newUser ? Object.keys(newUser) : 'null');
        console.log('Step 2c: newUser.id:', newUser?.id);
        
        if (!newUser) {
          throw new Error('Register API returned null/undefined');
        }
        
        if (!newUser.id) {
          console.error('newUser object:', JSON.stringify(newUser, null, 2));
          throw new Error('User object missing id field');
        }
        
        console.log('Step 3: Calling setUser with:', newUser);
        setUser(newUser);

        // Create preferences
        const colorPalette = getColorPalette(formData.accessibilityNeed);
        console.log('Step 4: Creating preferences for user ID:', newUser.id);
        console.log('Step 4a: Preference data:', {
          accessibility_need: formData.accessibilityNeed,
          reading_level: formData.readingLevel,
          preferred_complexity: formData.preferredComplexity,
          color_palette: colorPalette,
        });
        
        const newPreferences = await userService.updatePreferences(newUser.id, {
          accessibility_need: formData.accessibilityNeed,
          reading_level: formData.readingLevel,
          preferred_complexity: formData.preferredComplexity,
          color_palette: colorPalette,
        });
        
        console.log('Step 5: Preferences created:', newPreferences);
        setPreferences(newPreferences);
        console.log('=== REGISTRATION COMPLETE ===');
      } else {
        console.log('=== UPDATE EXISTING USER PATH ===');
        // Update existing user
        console.log('Step 1: Current user:', user);
        console.log('Step 1a: user.id:', user.id);
        
        if (!user.id) {
          throw new Error('User ID is missing from user object');
        }
        
        console.log('Step 2: Updating profile for user ID:', user.id);
        await userService.updateProfile(user.id, {
          name: formData.name,
          email: formData.email,
        });

        const colorPalette = getColorPalette(formData.accessibilityNeed);
        console.log('Step 3: Updating preferences for user ID:', user.id);
        const updatedPreferences = await userService.updatePreferences(user.id, {
          accessibility_need: formData.accessibilityNeed,
          reading_level: formData.readingLevel,
          preferred_complexity: formData.preferredComplexity,
          color_palette: colorPalette,
        });
        console.log('Step 4: Preferences updated:', updatedPreferences);
        setPreferences(updatedPreferences);
        console.log('=== UPDATE COMPLETE ===');
      }

      console.log('Navigating to rephrase page...');
      navigate('/rephrase');
    } catch (err: any) {
      console.error('=== ERROR CAUGHT ===');
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save user information. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== SUBMIT FINISHED ===');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoginMode || !user ? 'Create Your Account' : 'Update Your Profile'}
          </h2>
          <p className="text-gray-600 mb-8">
            Tell us about yourself to personalize your experience
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Accessibility Needs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Accessibility Preferences</h3>
              
              <div>
                <label htmlFor="accessibilityNeed" className="block text-sm font-medium text-gray-700 mb-1">
                  Accessibility Need
                </label>
                <select
                  id="accessibilityNeed"
                  value={formData.accessibilityNeed}
                  onChange={(e) => setFormData({ ...formData, accessibilityNeed: e.target.value as AccessibilityNeed })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="colorblind">Colorblind</option>
                  <option value="dyslexia">Dyslexia</option>
                  <option value="low-vision">Low Vision</option>
                  <option value="cognitive">Cognitive</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="readingLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Reading Level
                </label>
                <select
                  id="readingLevel"
                  value={formData.readingLevel}
                  onChange={(e) => setFormData({ ...formData, readingLevel: e.target.value as ReadingLevel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredComplexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Text Complexity
                </label>
                <select
                  id="preferredComplexity"
                  value={formData.preferredComplexity}
                  onChange={(e) => setFormData({ ...formData, preferredComplexity: e.target.value as ComplexityLevel })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="simple">Simple - Easy to understand</option>
                  <option value="moderate">Moderate - Balanced</option>
                  <option value="complex">Complex - Detailed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              {user && !isLoginMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/rephrase')}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className={(user && !isLoginMode) ? '' : 'w-full'}
              >
                {loading ? 'Saving...' : (isLoginMode || !user) ? 'Create Account & Continue' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAccountForm;
