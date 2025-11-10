import { useState, useEffect } from 'react';
import axios from 'axios';

export const useStoreData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/products');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  return { data, loading, error };
};