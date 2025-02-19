import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trip } from '../types/trip';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTrips(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTrip = async (trip: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .insert([trip])
        .select()
        .single();

      if (error) throw error;
      setTrips(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTrips(prev => prev.map(trip => trip.id === id ? data : trip));
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTrips(prev => prev.filter(trip => trip.id !== id));
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trips,
    isLoading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    refreshTrips: fetchTrips,
  };
}