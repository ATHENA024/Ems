import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <AppRoutes />
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default App;
