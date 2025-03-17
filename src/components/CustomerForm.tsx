import React, { useState, useEffect } from 'react';
import { saveCustomerData } from '../utils/storage';
import { CustomerData } from '../types';
import Confetti from 'react-confetti';
import { QRCodeSVG } from 'qrcode.react';
import { getFormFields } from '../utils/formConfig';

export default function CustomerForm() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number | string[]>>({});
  const [formFields, setFormFields] = useState<Array<{ id: string; name: string; type: string; required: boolean; options?: string[] }>>([]);

  // Load form fields
  useEffect(() => {
    const fields = getFormFields();
    setFormFields(fields);
    
    // Initialize form data with empty values
    const initialData: Record<string, string | number | string[]> = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transform form data to match CustomerData structure
    const id = crypto.randomUUID();
    
    // Find fields by their names to maintain compatibility with existing data structure
    const nameField = formFields.find(f => f.name === 'Name');
    const ageField = formFields.find(f => f.name === 'Age');
    const genderField = formFields.find(f => f.name === 'Gender');
    const phoneField = formFields.find(f => f.name === 'Phone Number');
    const emailField = formFields.find(f => f.name === 'Email');
    const placeField = formFields.find(f => f.name === 'Where are you from?');
    const foodField = formFields.find(f => f.name === 'What\'s your favorite dish from our menu?');
    const visitField = formFields.find(f => f.name === 'How often do you visit us?');
    const dietaryField = formFields.find(f => f.name === 'Dietary Preferences');
    
    // Create customer data object
    const customerData: CustomerData = {
      customFields: {},
      id,
      name: nameField ? String(formData[nameField.id]) : '',
      age: ageField ? parseInt(String(formData[ageField.id])) : 0,
      gender: genderField ? (['male', 'female', 'other'].includes(String(formData[genderField.id]).toLowerCase()) ? String(formData[genderField.id]).toLowerCase() as 'male' | 'female' | 'other' : 'other') : 'other',
      number: phoneField ? String(formData[phoneField.id]) : '',
      email: emailField ? String(formData[emailField.id]) : '',
      place: placeField ? String(formData[placeField.id]) : '',
      favoriteFood: foodField ? String(formData[foodField.id]) : '',
      visitFrequency: visitField ? 
        formData[visitField.id] === 'First Time' ? 'first' :
        formData[visitField.id] === 'Weekly' ? 'weekly' :
        formData[visitField.id] === 'Monthly' ? 'monthly' : 'yearly' 
        : 'first',
      dietaryPreferences: dietaryField ? (Array.isArray(formData[dietaryField.id]) ? formData[dietaryField.id] as string[] : []) : [],
      timestamp: new Date().toISOString()
    };
    
    // Add any additional custom fields
    formFields.forEach(field => {
      if (!['Name', 'Age', 'Gender', 'Phone Number', 'Email', 
            'Where are you from?', 'What\'s your favorite dish from our menu?',
            'How often do you visit us?', 'Dietary Preferences'].includes(field.name)) {
        if (!customerData.customFields) {
          customerData.customFields = {};
        }
        customerData.customFields[field.id] = {
          name: field.name,
          value: formData[field.id]
        };
      }
    });
    
    saveCustomerData(customerData);
    setSubmittedId(id);
    setShowConfetti(true);
  };

  const handleInputChange = (fieldId: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCheckboxChange = (fieldId: string, option: string) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      return {
        ...prev,
        [fieldId]: currentValues.includes(option)
          ? currentValues.filter((item: string) => item !== option)
          : [...currentValues, option]
      };
    });
  };

  const handleStartOver = () => {
    setSubmittedId(null);
    setShowConfetti(false);
    
    // Reset form data
    const initialData: Record<string, string | number | string[]> = {};
    formFields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.id] = [];
      } else {
        initialData[field.id] = '';
      }
    });
    setFormData(initialData);
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {showConfetti && <Confetti />}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Show this QR code at the counter to receive:
              </p>
              <div className="space-y-2 mb-8 text-left bg-blue-50 p-4 rounded-lg">
                <p className="flex items-center text-blue-800">
                  <span className="mr-2">•</span>
                  10% off your bill
                </p>
                <p className="flex items-center text-blue-800">
                  <span className="mr-2">•</span>
                  A complimentary Virgin Mojito
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeSVG
                  value={submittedId}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartOver}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Another Response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {showConfetti && <Confetti />}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            We'd Love Your Feedback!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Help us serve you better by sharing your preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  id={field.id}
                  required={field.required}
                  min="1"
                  max="120"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {field.type === 'email' && (
                <input
                  type="email"
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {field.type === 'tel' && (
                <input
                  type="tel"
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
              
              {field.type === 'select' && (
                <select
                  id={field.id}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select {field.name.toLowerCase()}</option>
                  {field.options && field.options.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {field.type === 'checkbox' && (
                <div className="space-y-2">
                  {field.options && field.options.map((option: string) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData[field.id]) && (formData[field.id] as string[]).includes(option)}
                        onChange={() => handleCheckboxChange(field.id, option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}