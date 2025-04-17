// File: src/components/common/NotificationItem.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';

const NotificationItem = ({ notification, onPress, onMarkAsRead }) => {
  const { id, title, message, type, read, timestamp } = notification;
  
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
  
  return (
    <TouchableOpacity 
      style={[styles.container, read && styles.readContainer]} 
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, read && styles.readText]}>{title}</Text>
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
          onPress={() => onMarkAsRead(id)}
        >
          <Text style={styles.markButtonText}>Mark as read</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  title: {
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

export default NotificationItem;