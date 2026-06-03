import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';

export function useEmployee(employeeId) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getById(employeeId);
        setEmployee(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch employee');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return { employee, loading, error };
}
