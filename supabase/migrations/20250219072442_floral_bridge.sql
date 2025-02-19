/*
  # Create Trip Planning Schema

  1. New Tables
    - `trips`
      - Core trip information
      - Includes title, dates, and visibility settings
    - `locations`
      - Places that can be added to trips
      - Stores geographical data and place details
    - `activities`
      - Scheduled events within trips
      - Links trips with locations and timing
  
  2. Security
    - Enable RLS on all tables
    - Policies for user access control
*/

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  cover_image text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  location_id uuid REFERENCES locations(id) NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  cost decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_times CHECK (end_time >= start_time)
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Trips policies
CREATE POLICY "Users can view their own trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Locations policies
CREATE POLICY "Anyone can view locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Activities policies
CREATE POLICY "Users can view activities of their trips"
  ON activities
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = activities.trip_id 
    AND (trips.user_id = auth.uid() OR trips.is_public = true)
  ));

CREATE POLICY "Users can create activities for their trips"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = activities.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update activities of their trips"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = activities.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete activities of their trips"
  ON activities
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM trips 
    WHERE trips.id = activities.trip_id 
    AND trips.user_id = auth.uid()
  ));