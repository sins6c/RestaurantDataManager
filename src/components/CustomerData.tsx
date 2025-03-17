import { useState, useMemo } from 'react';
import { getCustomerData } from '../utils/storage';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { Download, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';

type CustomerData = {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  number: string;
  place: string;
  favoriteFood: string;
  visitFrequency: string;
  dietaryPreferences: string[];
  timestamp: string;
};

export default function CustomerData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const customerData = getCustomerData();

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...customerData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Age filter
    if (ageFilter !== 'all') {
      const [min, max] = ageFilter.split('-').map(Number);
      filtered = filtered.filter(customer => 
        customer.age >= min && (max ? customer.age <= max : true)
      );
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(customer => 
        customer.gender === genderFilter
      );
    }

    // Date filter
    const days = parseInt(dateFilter);
    const startDate = subDays(new Date(), days);
    filtered = filtered.filter(customer =>
      isWithinInterval(parseISO(customer.timestamp), {
        start: startDate,
        end: new Date()
      })
    );

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key as keyof CustomerData] < b[sortConfig.key as keyof CustomerData]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof CustomerData] > b[sortConfig.key as keyof CustomerData]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [customerData, searchTerm, ageFilter, genderFilter, dateFilter, sortConfig]);

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert the data to the format we want to export
    const exportData = filteredAndSortedData.map(customer => ({
      Name: customer.name,
      Age: customer.age,
      Gender: customer.gender,
      Email: customer.email,
      Phone: customer.number,
      Location: customer.place,
      'Favorite Food': customer.favoriteFood,
      'Visit Frequency': customer.visitFrequency,
      'Dietary Preferences': customer.dietaryPreferences.join(', '),
      'Submission Date': format(parseISO(customer.timestamp), 'MMM d, yyyy')
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Data');

    // Generate the file and trigger download
    XLSX.writeFile(workbook, 'customer_data.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Data</h2>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Ages</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46">46+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Total Entries</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{filteredAndSortedData.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Average Age</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {Math.round(
                  filteredAndSortedData.reduce((acc, curr) => acc + curr.age, 0) / 
                  filteredAndSortedData.length
                ) || 0}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Most Common Location</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                {filteredAndSortedData.length > 0
                  ? Object.entries(
                      filteredAndSortedData.reduce((acc, curr) => {
                        acc[curr.place] = (acc[curr.place] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('age')}
                  >
                    <div className="flex items-center">
                      Age
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('gender')}
                  >
                    <div className="flex items-center">
                      Gender
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('place')}
                  >
                    <div className="flex items-center">
                      Location
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedData.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {customer.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {customer.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div>
                        <div>{customer.email}</div>
                        <div>{customer.number}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {customer.place}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {format(parseISO(customer.timestamp), 'MMM d, yyyy')}
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