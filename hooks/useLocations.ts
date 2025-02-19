import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Location } from '../types/trip';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setLocations(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addLocation = async (location: Omit<Location, 'id'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .insert([location])
        .select()
        .single();

      if (error) throw error;
      setLocations(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locations,
    isLoading,
    error,
    addLocation,
    refreshLocations: fetchLocations,
  };
}