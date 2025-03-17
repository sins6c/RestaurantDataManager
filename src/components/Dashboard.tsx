import React, { useState } from 'react';
import { Edit, Save, XCircle, Search, Plus, Trash, Settings, QrCode, BarChart2 } from 'lucide-react';
import { getFormFields, updateFormFields } from '../utils/formConfig';
import { getCustomerData } from '../utils/storage';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';

export default function Dashboard() {
  const [formFields, setFormFields] = useState(getFormFields());
  const [newField, setNewField] = useState({
    name: '',
    type: 'text',
    required: false,
    options: [] as string[],
  });
  const [showNewFieldForm, setShowNewFieldForm] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7');

  const customerData = getCustomerData();

  // Filter customer data
  const filteredData = customerData.filter(customer => {
    let matches = true;

    // Age filter
    if (ageFilter !== 'all') {
      const [min, max] = ageFilter.split('-').map(Number);
      matches = matches && customer.age >= min && (max ? customer.age <= max : true);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      matches = matches && customer.gender === genderFilter;
    }

    // Date filter
    if (dateFilter) {
      const days = parseInt(dateFilter);
      const startDate = subDays(new Date(), days);
      matches = matches && isWithinInterval(parseISO(customer.timestamp), {
        start: startDate,
        end: new Date()
      });
    }

    return matches;
  });

  const handleAddField = () => {
    if (!newField.name) return;

    const newId = (formFields.length + 1).toString();
    const fieldToAdd = {
      id: newId,
      name: newField.name,
      type: newField.type,
      required: newField.required,
      options: newField.type === 'select' || newField.type === 'checkbox' ? newField.options : undefined
    };

    const updatedFields = [...formFields, fieldToAdd];
    setFormFields(updatedFields);
    updateFormFields(updatedFields);
    setNewField({ name: '', type: 'text', required: false, options: [] });
    setShowNewFieldForm(false);
  };

  const handleAddOption = () => {
    if (!newOption) return;
    setNewField({
      ...newField,
      options: [...newField.options, newOption]
    });
    setNewOption('');
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setNewField({
      ...newField,
      options: newField.options.filter(option => option !== optionToRemove)
    });
  };

  const handleRemoveField = (fieldId: string) => {
    const updatedFields = formFields.filter(field => field.id !== fieldId);
    setFormFields(updatedFields);
    updateFormFields(updatedFields);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formFields.length) return;
    
    const updatedFields = [...formFields];
    [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
    setFormFields(updatedFields);
    updateFormFields(updatedFields);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Responses</h3>
              <p className="text-3xl font-bold text-blue-600">{filteredData.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Today's Responses</h3>
              <p className="text-3xl font-bold text-green-600">
                {filteredData.filter(customer => 
                  isWithinInterval(parseISO(customer.timestamp), {
                    start: new Date(new Date().setHours(0,0,0,0)),
                    end: new Date()
                  })
                ).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Active Fields</h3>
              <p className="text-3xl font-bold text-purple-600">{formFields.length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900">Required Fields</h3>
              <p className="text-3xl font-bold text-orange-600">
                {formFields.filter(field => field.required).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Ages</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46">46+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Form Field Management</h2>
            <button
              onClick={() => setShowNewFieldForm(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Field
            </button>
          </div>

          {showNewFieldForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-4">Add New Field</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Name</label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter field name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Dropdown</option>
                    <option value="checkbox">Checkbox Group</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Required field</span>
                </label>
              </div>

              {(newField.type === 'select' || newField.type === 'checkbox') && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter option"
                    />
                    <button
                      onClick={handleAddOption}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  {newField.options.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {newField.options.map((option, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                          <span className="text-sm text-gray-700">{option}</span>
                          <button
                            onClick={() => handleRemoveOption(option)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewFieldForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Field
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formFields.map((field, index) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{field.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{field.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.required ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove field"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveField(index, 'up')}
                          className={`text-gray-600 hover:text-gray-900 ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move up"
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveField(index, 'down')}
                          className={`text-gray-600 hover:text-gray-900 ${index === formFields.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                          title="Move down"
                          disabled={index === formFields.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}