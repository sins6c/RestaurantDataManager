// Form configuration storage and management

export interface FormField {
    id: string;
    name: string;
    type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
    required: boolean;
    options?: string[];
  }
  
  // Default form fields
  const DEFAULT_FORM_FIELDS: FormField[] = [
    {
      id: '1',
      name: 'Name',
      type: 'text',
      required: true
    },
    {
      id: '2',
      name: 'Age',
      type: 'number',
      required: true
    },
    {
      id: '3',
      name: 'Gender',
      type: 'select',
      required: true,
      options: ['Male', 'Female', 'Other']
    },
    {
      id: '4',
      name: 'Phone Number',
      type: 'tel',
      required: true
    },
    {
      id: '5',
      name: 'Email',
      type: 'email',
      required: true
    },
    {
      id: '6',
      name: 'Where are you from?',
      type: 'text',
      required: true
    },
    {
      id: '7',
      name: 'What\'s your favorite dish from our menu?',
      type: 'text',
      required: true
    },
    {
      id: '8',
      name: 'How often do you visit us?',
      type: 'select',
      required: true,
      options: ['First Time', 'Weekly', 'Monthly', 'Yearly']
    },
    {
      id: '9',
      name: 'Dietary Preferences',
      type: 'checkbox',
      required: false,
      options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free']
    }
  ];
  
  // Get form fields from localStorage or use defaults
  export const getFormFields = (): FormField[] => {
    const storedFields = localStorage.getItem('formFields');
    return storedFields ? JSON.parse(storedFields) : DEFAULT_FORM_FIELDS;
  };
  
  // Update form fields in localStorage
  export const updateFormFields = (fields: FormField[]): void => {
    localStorage.setItem('formFields', JSON.stringify(fields));
  };
  
  // Reset form fields to default
  export const resetFormFields = (): FormField[] => {
    localStorage.setItem('formFields', JSON.stringify(DEFAULT_FORM_FIELDS));
    return DEFAULT_FORM_FIELDS;
  };