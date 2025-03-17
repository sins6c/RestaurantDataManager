
import { getCustomerData } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, MapPin, Utensils } from 'lucide-react';

export default function Analytics() {
  const customerData = getCustomerData();

  // Visitor frequency analysis
  const visitFrequencyData = [
    { name: 'First Time', value: 0 },
    { name: 'Weekly', value: 0 },
    { name: 'Monthly', value: 0 },
    { name: 'Yearly', value: 0 }
  ];

  customerData.forEach(customer => {
    const frequency = customer.visitFrequency;
    const index = visitFrequencyData.findIndex(item => 
      item.name.toLowerCase() === (
        frequency === 'first' ? 'first time' :
        frequency === 'weekly' ? 'weekly' :
        frequency === 'monthly' ? 'monthly' : 'yearly'
      )
    );
    if (index !== -1) {
      visitFrequencyData[index].value++;
    }
  });

  // Dietary preferences analysis
  const dietaryData = [
    { name: 'Vegetarian', value: 0 },
    { name: 'Non-Vegetarian', value: 0 },
    { name: 'Vegan', value: 0 },
    { name: 'Gluten-Free', value: 0 }
  ];

  customerData.forEach(customer => {
    customer.dietaryPreferences.forEach(pref => {
      const index = dietaryData.findIndex(item => item.name === pref);
      if (index !== -1) {
        dietaryData[index].value++;
      }
    });
  });

  // Popular dishes analysis
  const dishesMap = new Map();
  customerData.forEach(customer => {
    const dish = customer.favoriteFood;
    dishesMap.set(dish, (dishesMap.get(dish) || 0) + 1);
  });

  const popularDishes = Array.from(dishesMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Location analysis
  const locationMap = new Map();
  customerData.forEach(customer => {
    const location = customer.place;
    locationMap.set(location, (locationMap.get(location) || 0) + 1);
  });

  const locationData = Array.from(locationMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  interface CardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number;
    description: string;
  }

  const Card = ({ icon: Icon, title, value, description }: CardProps) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-3xl font-bold text-blue-600">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            icon={Users}
            title="Total Customers"
            value={customerData.length}
            description="Total number of feedback submissions"
          />
          <Card
            icon={Clock}
            title="Regular Customers"
            value={customerData.filter(c => c.visitFrequency === 'weekly' || c.visitFrequency === 'monthly').length}
            description="Weekly and monthly visitors"
          />
          <Card
            icon={MapPin}
            title="Unique Locations"
            value={locationMap.size}
            description="Different areas customers visit from"
          />
          <Card
            icon={Utensils}
            title="Popular Dishes"
            value={dishesMap.size}
            description="Different favorite dishes mentioned"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visit Frequency Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit Frequency</h2>
            <div className="h-[300px]">
              <BarChart
                width={500}
                height={300}
                data={visitFrequencyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" name="Customers" />
              </BarChart>
            </div>
          </div>

          {/* Dietary Preferences Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</h2>
            <div className="h-[300px]">
              <PieChart width={500} height={300}>
                <Pie
                  data={dietaryData.filter(d => d.value > 0)}
                  cx={250}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dietaryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Popular Dishes</h2>
            <div className="h-[300px]">
              <BarChart
                width={500}
                height={300}
                data={popularDishes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00C49F" name="Times Mentioned" />
              </BarChart>
            </div>
          </div>

          {/* Customer Locations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Customer Locations</h2>
            <div className="h-[300px]">
              <BarChart
                width={500}
                height={300}
                data={locationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FFBB28" name="Number of Customers" />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}