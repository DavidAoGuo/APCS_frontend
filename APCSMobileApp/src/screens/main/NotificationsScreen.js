// Replace your entire NotificationsScreen.js with this code
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../../components/common';
import { clearNotifications, fetchNotifications, markNotificationRead } from '../../store/actions/notificationActions';
import { theme } from '../../theme';

// Notification Item Component
const NotificationItem = ({ notification, onPress, onMarkAsRead }) => {
  // Make sure we're getting the actual data structure from MongoDB
  const { _id, title, message, type, read, timestamp } = notification;
  
  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <Ionicons name="warning-outline" size={24} color="#F9A825" />;
      case 'danger':
        return <Ionicons name="alert-circle-outline" size={24} color="#D32F2F" />;
      case 'success':
        return <Ionicons name="checkmark-circle-outline" size={24} color="#388E3C" />;
      default:
        return <Ionicons name="information-circle-outline" size={24} color="#1976D2" />;
    }
  };
  
  console.log(`Rendering notification with ID: ${_id}, read status: ${read}`);
  
  return (
    <TouchableOpacity 
      style={[styles.notificationItem, read && styles.readContainer]} 
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.notificationTitle, read && styles.readText]}>{title}</Text>
          <Text style={styles.time}>{formatDate(timestamp)}</Text>
        </View>
        <Text 
          style={[styles.message, read && styles.readText]} 
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>
      {!read && (
        <TouchableOpacity 
          style={styles.markButton}
          onPress={() => {
            console.log(`Mark as read button pressed for notification: ${_id}`);
            onMarkAsRead(_id);
          }}
        >
          <Text style={styles.markButtonText}>Mark as read</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notifications || { notifications: [], loading: false, error: null });
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    console.log('Loading notifications...');
    try {
      await dispatch(fetchNotifications());
      console.log('Notifications loaded successfully');
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };
  
  const handleNotificationPress = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    
    // Show notification details
    if (Platform.OS === 'web') {
      window.alert(`${notification.title}\n\n${notification.message}`);
    } else {
      Alert.alert(
        notification.title,
        notification.message,
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleMarkAsRead = async (id) => {
    console.log(`Marking notification as read - ID: ${id}, Type: ${typeof id}`);
    try {
      // Ensure ID is a string if it's an object
      const idToUse = typeof id === 'object' ? id.toString() : id;
      await dispatch(markNotificationRead(idToUse));
      console.log('Mark as read action dispatched');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      if (Platform.OS === 'web') {
        window.alert('Error: Failed to mark notification as read');
      } else {
        Alert.alert('Error', 'Failed to mark notification as read');
      }
    }
  };
  
  const handleClearAll = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to clear all notifications?')) {
        dispatch(clearNotifications());
      }
    } else {
      Alert.alert(
        'Clear Notifications',
        'Are you sure you want to clear all notifications?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Clear All', 
            style: 'destructive',
            onPress: () => dispatch(clearNotifications())
          }
        ]
      );
    }
  };
  
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={60} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>No notifications</Text>
      <Text style={styles.emptySubtext}>You're all caught up!</Text>
    </View>
  );
  
  // Log current notifications for debugging
  console.log('Current notifications:', JSON.stringify(notifications?.slice(0, 2), null, 2));
  
  if (loading && !refreshing) {
    return <Loading fullscreen message="Loading notifications..." />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {notifications && notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={notifications || []}
        keyExtractor={item => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
        contentContainerStyle={[
          styles.listContainer,
          (!notifications || notifications.length === 0) && styles.emptyListContainer
        ]}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.metrics.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  clearText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.primary,
  },
  listContainer: {
    padding: theme.metrics.spacing.medium,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.metrics.spacing.large,
  },
  emptyText: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.metrics.spacing.medium,
    marginBottom: theme.metrics.spacing.small,
  },
  emptySubtext: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: theme.metrics.spacing.medium,
    margin: theme.metrics.spacing.medium,
    borderRadius: theme.metrics.borderRadius.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fonts.sizes.small,
    flex: 1,
  },
  retryButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.metrics.spacing.tiny,
    paddingHorizontal: theme.metrics.spacing.small,
    borderRadius: theme.metrics.borderRadius.small,
  },
  retryText: {
    color: theme.colors.background,
    fontSize: theme.fonts.sizes.small,
    fontWeight: 'bold',
  },
  // NotificationItem styles
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.metrics.borderRadius.small,
    marginBottom: theme.metrics.spacing.medium,
    padding: theme.metrics.spacing.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  readContainer: {
    backgroundColor: theme.colors.background,
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: theme.metrics.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.tiny,
  },
  notificationTitle: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  time: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginLeft: theme.metrics.spacing.small,
  },
  message: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.text,
  },
  readText: {
    color: theme.colors.textSecondary,
  },
  markButton: {
    marginLeft: theme.metrics.spacing.small,
    justifyContent: 'center',
  },
  markButtonText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;