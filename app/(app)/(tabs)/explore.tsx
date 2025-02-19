import { useState, useRef, Suspense, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocations } from '../../../hooks/useLocations';
import * as THREE from 'three';

const LOCATION_TYPES = [
  { id: 'all', label: 'All', icon: 'globe' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'activity', label: 'Activity', icon: 'bicycle' },
  { id: 'landmark', label: 'Landmark', icon: 'business' },
  { id: 'nature', label: 'Nature', icon: 'leaf' },
];

function Earth() {
  const earthRef = useRef();

  return (
    <mesh ref={earthRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhongMaterial
        map={new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
        )}
        bumpMap={new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'
        )}
        bumpScale={0.05}
        specularMap={new THREE.TextureLoader().load(
          'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
        )}
        specular={new THREE.Color('grey')}
      />
    </mesh>
  );
}

function LocationPoint({ position, onClick, color = '#FF385C', isHighlighted }) {
  const scale = isHighlighted ? [0.03, 0.03, 0.03] : [0.02, 0.02, 0.02];
  
  return (
    <mesh position={position} onClick={onClick} scale={scale}>
      <sphereGeometry />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Scene({ selectedType, onLocationSelect }) {
  const { locations } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filteredLocations = locations.filter(
    location => selectedType === 'all' || location.type === selectedType
  );

  const convertLatLngToVector3 = (lat: number, lng: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(Math.sin(phi) * Math.cos(theta));
    const z = Math.sin(phi) * Math.sin(theta);
    const y = Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Earth />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.5}
      />
      {filteredLocations.map((location) => (
        <LocationPoint
          key={location.id}
          position={convertLatLngToVector3(location.latitude, location.longitude)}
          onClick={() => handleLocationClick(location)}
          isHighlighted={selectedLocation?.id === location.id}
        />
      ))}
    </>
  );
}

function LocationDetailsModal({ location, visible, onClose }) {
  if (!location) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{location.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.locationTypeBadge}>
              <Ionicons name={LOCATION_TYPES.find(t => t.id === location.type)?.icon || 'location'} size={16} color="#fff" />
              <Text style={styles.locationTypeText}>
                {LOCATION_TYPES.find(t => t.id === location.type)?.label || 'Location'}
              </Text>
            </View>
            
            <Text style={styles.locationDescription}>{location.description}</Text>
            
            {location.address && (
              <View style={styles.locationDetail}>
                <Ionicons name="location" size={20} color="#666" />
                <Text style={styles.locationDetailText}>{location.address}</Text>
              </View>
            )}
            
            <View style={styles.locationCoordinates}>
              <Text style={styles.coordinatesText}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function ExploreScreen() {
  const { locations, isLoading, error } = useLocations();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    if (Platform.OS !== 'web' && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  const filteredLocations = locations.filter(
    location => selectedType === 'all' || location.type === selectedType
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {LOCATION_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                selectedType === type.id && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={20}
                color={selectedType === type.id ? '#fff' : '#FF385C'}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType === type.id && styles.filterButtonTextActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {Platform.OS === 'web' ? (
        <Canvas style={styles.canvas} camera={{ position: [0, 0, 3] }}>
          <Suspense fallback={null}>
            <Scene
              selectedType={selectedType}
              onLocationSelect={handleLocationSelect}
            />
          </Suspense>
        </Canvas>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 40.7128,
            longitude: -74.0060,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              onPress={() => handleLocationSelect(location)}
            >
              <View style={[
                styles.markerContainer,
                selectedLocation?.id === location.id && styles.markerContainerActive
              ]}>
                <Ionicons
                  name={LOCATION_TYPES.find(t => t.id === location.type)?.icon || 'location'}
                  size={24}
                  color="#FF385C"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      <LocationDetailsModal
        location={selectedLocation}
        visible={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#000' : '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF385C',
    fontSize: 16,
    textAlign: 'center',
  },
  canvas: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    padding: 12,
    backgroundColor: Platform.OS === 'web' ? '#000' : '#fff',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.1)' : '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FF385C',
  },
  filterButtonActive: {
    backgroundColor: '#FF385C',
  },
  filterButtonText: {
    color: '#FF385C',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  markerContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF385C',
  },
  markerContainerActive: {
    transform: [{ scale: 1.2 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  locationTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF385C',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  locationTypeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  locationDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationDetailText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  locationCoordinates: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  coordinatesText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#666',
  },
});