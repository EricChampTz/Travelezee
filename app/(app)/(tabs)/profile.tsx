import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useTrips } from '../../../hooks/useTrips';

export default function ProfileScreen() {
  const { signOut, isLoading } = useAuth();
  const { trips } = useTrips();
  const [selectedTab, setSelectedTab] = useState('trips');

  const stats = {
    trips: trips.length,
    followers: 0,
    following: 0,
  };

  const roles = ['Adventurer'];
  if (trips.length >= 5) {
    roles.push('Trip Sharer');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1488085061387-422e29b40080' }}
            style={styles.coverImage}
          />
        </View>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>JD</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>Adventure seeker | Travel enthusiast</Text>

        <View style={styles.rolesContainer}>
          {roles.map((role, index) => (
            <View key={role} style={[styles.roleBadge, index > 0 && styles.roleBadgeMargin]}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.trips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'trips' && styles.activeTab]}
            onPress={() => setSelectedTab('trips')}
          >
            <Ionicons
              name="airplane"
              size={20}
              color={selectedTab === 'trips' ? '#FF385C' : '#666'}
            />
            <Text style={[styles.tabText, selectedTab === 'trips' && styles.activeTabText]}>
              Trips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'saved' && styles.activeTab]}
            onPress={() => setSelectedTab('saved')}
          >
            <Ionicons
              name="bookmark"
              size={20}
              color={selectedTab === 'saved' ? '#FF385C' : '#666'}
            />
            <Text style={[styles.tabText, selectedTab === 'saved' && styles.activeTabText]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'trips' && trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No trips yet</Text>
            <Text style={styles.emptyStateSubtext}>Start planning your next adventure!</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.signOutButton, isLoading && styles.buttonDisabled]}
          onPress={signOut}
          disabled={isLoading}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
  },
  coverImageContainer: {
    height: 150,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    transform: [{ translateY: 20 }],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleBadge: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleBadgeMargin: {
    marginLeft: 8,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF385C',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF385C',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  signOutButton: {
    backgroundColor: '#FF385C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});