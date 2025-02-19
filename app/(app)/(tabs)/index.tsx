import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../../../hooks/useTrips';

export default function HomeScreen() {
  const { trips, isLoading, error } = useTrips();

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

  const myTrips = trips.filter(trip => !trip.isPublic);
  const exploreTrips = trips.filter(trip => trip.isPublic);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Trips</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tripsScroll}>
        {myTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="airplane-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No trips yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first trip!</Text>
          </View>
        ) : (
          myTrips.map(trip => (
            <TouchableOpacity key={trip.id} style={styles.tripCard}>
              <View style={styles.tripImageContainer}>
                <Image
                  source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080' }}
                  style={styles.tripImage}
                />
                <View style={styles.tripDateBadge}>
                  <Text style={styles.tripDateText}>
                    {new Date(trip.startDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDescription} numberOfLines={2}>
                {trip.description || 'No description'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.header}>
        <Text style={styles.title}>Explore Trips</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.exploreGrid}>
        {exploreTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="compass-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No public trips</Text>
            <Text style={styles.emptyStateSubtext}>Be the first to share!</Text>
          </View>
        ) : (
          exploreTrips.map(trip => (
            <TouchableOpacity key={trip.id} style={styles.exploreCard}>
              <View style={styles.exploreImageContainer}>
                <Image
                  source={{ uri: trip.coverImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080' }}
                  style={styles.exploreImage}
                />
                <View style={styles.tripTypeBadge}>
                  <Text style={styles.tripTypeText}>Adventure</Text>
                </View>
              </View>
              <Text style={styles.exploreTitle}>{trip.title}</Text>
              <View style={styles.exploreFooter}>
                <View style={styles.authorContainer}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorInitials}>JD</Text>
                  </View>
                  <Text style={styles.exploreAuthor}>John Doe</Text>
                </View>
                <View style={styles.likesContainer}>
                  <Ionicons name="heart" size={16} color="#FF385C" />
                  <Text style={styles.likesCount}>0</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: '#FF385C',
    textAlign: 'center',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FF385C',
    fontSize: 16,
  },
  tripsScroll: {
    paddingLeft: 16,
  },
  tripCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripDateBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tripDateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
    paddingBottom: 4,
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  exploreGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exploreCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exploreImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tripTypeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF385C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tripTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    paddingBottom: 4,
  },
  exploreFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorInitials: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  exploreAuthor: {
    fontSize: 14,
    color: '#666',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
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
});