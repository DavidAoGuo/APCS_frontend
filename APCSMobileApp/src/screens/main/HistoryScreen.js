// File: src/screens/main/HistoryScreen.js
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Loading } from '../../components/common';
import { fetchSensorHistory } from '../../store/actions/sensorActions';
import { theme } from '../../theme';
import platformAlert from '../../utils/platformAlert';

const HistoryScreen = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'custom'
  const [selectedMetric, setSelectedMetric] = useState('food'); // 'food', 'water', 'temperature', 'humidity'
  
  // Get data from redux store
  const { history, historyLoading: loading } = useSelector(state => state.sensors);
  
  // Date range selection
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start'); // 'start' or 'end'
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7))); // 1 week ago
  const [endDate, setEndDate] = useState(new Date()); // today
  
  // Load history data when component mounts or when timeRange/selectedMetric changes
  useEffect(() => {
    loadHistoryData();
  }, [timeRange, selectedMetric, startDate, endDate]);
  
  const loadHistoryData = async () => {
    try {
      // For custom date range, we need to pass additional parameters
      if (timeRange === 'custom') {
        await dispatch(fetchSensorHistory(
          selectedMetric, 
          timeRange, 
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        ));
      } else {
        await dispatch(fetchSensorHistory(selectedMetric, timeRange));
      }
    } catch (error) {
      console.error('Error loading history data:', error);
    }
  };
  
  const getChartColor = () => {
    switch (selectedMetric) {
      case 'food':
        return theme.colors.primary;
      case 'water':
        return theme.colors.secondary;
      case 'temperature':
        return '#FF9800'; // Orange
      case 'humidity':
        return '#8BC34A'; // Light green
      default:
        return theme.colors.primary;
    }
  };
  
  const getCurrentData = () => {
    return history[selectedMetric] || [];
  };
  
  const calculateAverage = () => {
    const data = getCurrentData();
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.y, 0);
    return Math.round(sum / data.length);
  };
  
  const getMin = () => {
    const data = getCurrentData();
    if (data.length === 0) return 0;
    return Math.min(...data.map(item => item.y));
  };
  
  const getMax = () => {
    const data = getCurrentData();
    if (data.length === 0) return 0;
    return Math.max(...data.map(item => item.y));
  };
  
  const getUnitLabel = () => {
    return selectedMetric === 'temperature' ? '°C' : '%';
  };
  
  const formatDate = (date) => {
    // Create a new date with time set to noon to avoid timezone issues
    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);
    
    return adjustedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    
    // Set appropriate start date based on selected range
    const now = new Date();
    let start = new Date();
    
    switch (range) {
      case 'day':
        start = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'custom':
        // Keep current date range for custom
        break;
    }
    
    if (range !== 'custom') {
      setStartDate(start);
      setEndDate(new Date());
    }
  };
  
  const showDateSelection = () => {
    setDatePickerMode('start');
    setShowDatePicker(true);
  };
  
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      if (datePickerMode === 'start') {
        // For start date, only check that it's not after today
        if (selectedDate > new Date()) {
          platformAlert('Invalid Date Range', 'Start date cannot be in the future.');
          return;
        }
        setStartDate(selectedDate);
        
        if (Platform.OS === 'ios') {
          setDatePickerMode('end');
        } else {
          setTimeout(() => {
            setDatePickerMode('end');
            setShowDatePicker(true);
          }, 500);
        }
      } else {
        // For end date, check against the newly set start date
        if (selectedDate < startDate) {
          platformAlert('Invalid Date Range', 'End date cannot be before start date.');
          return;
        }
        if (selectedDate > new Date()) {
          platformAlert('Invalid Date Range', 'End date cannot be in the future.');
          return;
        }
        setEndDate(selectedDate);
        setShowDatePicker(false);
        
        // Force refresh the data with new date range
        setTimeout(() => {
          loadHistoryData();
        }, 100);
      }
    } else {
      setShowDatePicker(false);
    }
  };
  
  const getDateRangeTitle = () => {
    if (timeRange === 'custom') {
      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    }
    
    return `Last ${timeRange}`;
  };
  
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>View historical data for your pet care system</Text>
        
        <Card title="Metrics">
          <View style={styles.metricsContainer}>
            <TouchableOpacity 
              style={[
                styles.metricButton, 
                selectedMetric === 'food' && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => setSelectedMetric('food')}
            >
              <Ionicons 
                name="restaurant-outline" 
                size={20} 
                color={selectedMetric === 'food' ? theme.colors.background : theme.colors.primary} 
              />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'food' && { color: theme.colors.background }
              ]}>Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.metricButton, 
                selectedMetric === 'water' && { backgroundColor: theme.colors.secondary }
              ]}
              onPress={() => setSelectedMetric('water')}
            >
              <Ionicons 
                name="water-outline" 
                size={20} 
                color={selectedMetric === 'water' ? theme.colors.background : theme.colors.secondary} 
              />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'water' && { color: theme.colors.background }
              ]}>Water</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.metricButton, 
                selectedMetric === 'temperature' && { backgroundColor: '#FF9800' }
              ]}
              onPress={() => setSelectedMetric('temperature')}
            >
              <Ionicons 
                name="thermometer-outline" 
                size={20} 
                color={selectedMetric === 'temperature' ? theme.colors.background : '#FF9800'} 
              />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'temperature' && { color: theme.colors.background }
              ]}>Temp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.metricButton, 
                selectedMetric === 'humidity' && { backgroundColor: '#8BC34A' }
              ]}
              onPress={() => setSelectedMetric('humidity')}
            >
              <Ionicons 
                name="water" 
                size={20} 
                color={selectedMetric === 'humidity' ? theme.colors.background : '#8BC34A'} 
              />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'humidity' && { color: theme.colors.background }
              ]}>Humidity</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <Card title="Time Range">
          <View style={styles.timeRangeContainer}>
            <TouchableOpacity 
              style={[
                styles.timeButton, 
                timeRange === 'day' && styles.selectedTimeButton
              ]}
              onPress={() => handleTimeRangeSelect('day')}
            >
              <Text style={[
                styles.timeButtonText, 
                timeRange === 'day' && styles.selectedTimeButtonText
              ]}>Day</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeButton, 
                timeRange === 'week' && styles.selectedTimeButton
              ]}
              onPress={() => handleTimeRangeSelect('week')}
            >
              <Text style={[
                styles.timeButtonText, 
                timeRange === 'week' && styles.selectedTimeButtonText
              ]}>Week</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeButton, 
                timeRange === 'month' && styles.selectedTimeButton
              ]}
              onPress={() => handleTimeRangeSelect('month')}
            >
              <Text style={[
                styles.timeButtonText, 
                timeRange === 'month' && styles.selectedTimeButtonText
              ]}>Month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeButton, 
                timeRange === 'custom' && styles.selectedTimeButton
              ]}
              onPress={() => handleTimeRangeSelect('custom')}
            >
              <Text style={[
                styles.timeButtonText, 
                timeRange === 'custom' && styles.selectedTimeButtonText
              ]}>Custom</Text>
            </TouchableOpacity>
          </View>
          
          {timeRange === 'custom' && (
            <View style={styles.customDateContainer}>
              <TouchableOpacity 
                style={styles.dateRangeButton}
                onPress={showDateSelection}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.dateRangeText}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
        
        <Card 
          title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} History (${getDateRangeTitle()})`}
          style={styles.chartCard}
        >
          {loading ? (
            <Loading />
          ) : (
            <View style={styles.chartContainer}>
              {getCurrentData().length > 0 ? (
                <View style={styles.dataPointsContainer}>
                  {getCurrentData().map((item, index) => (
                    <View key={index} style={styles.dataPoint}>
                      <Text style={styles.dataDate}>{item.x}</Text>
                      <Text style={[styles.dataValue, { color: getChartColor() }]}>
                        {item.y}{getUnitLabel()}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Ionicons name="analytics-outline" size={50} color={theme.colors.textSecondary} />
                  <Text style={styles.noDataText}>
                    No data available for the selected time range.
                  </Text>
                  <Text style={styles.noDataSubtext}>
                    Try selecting a different time range or metric.
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>
        
        <Card title="Stats" style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={[styles.statValue, { color: getChartColor() }]}>
                {loading ? '-' : `${calculateAverage()}${getUnitLabel()}`}
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Min</Text>
              <Text style={[styles.statValue, { color: getChartColor() }]}>
                {loading ? '-' : `${getMin()}${getUnitLabel()}`}
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max</Text>
              <Text style={[styles.statValue, { color: getChartColor() }]}>
                {loading ? '-' : `${getMax()}${getUnitLabel()}`}
              </Text>
            </View>
          </View>
        </Card>
      </View>
      
      {showDatePicker && (
        Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Select {datePickerMode === 'start' ? 'Start' : 'End'} Date
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
                
                <DateTimePicker
                  value={datePickerMode === 'start' ? startDate : endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  style={styles.datePicker}
                  maximumDate={new Date()}
                />
                
                {Platform.OS === 'ios' && (
                  <Button
                    title={datePickerMode === 'start' ? 'Next' : 'Done'}
                    onPress={() => {
                      if (datePickerMode === 'start') {
                        setDatePickerMode('end');
                      } else {
                        setShowDatePicker(false);
                      }
                    }}
                    style={styles.datePickerButton}
                  />
                )}
              </View>
            </View>
          </Modal>
        ) : (
          // Web implementation using native date input
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Select {datePickerMode === 'start' ? 'Start' : 'End'} Date
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.webDatePickerContainer}>
                  <input 
                    type="date"
                    value={datePickerMode === 'start' 
                      ? startDate.toISOString().split('T')[0] 
                      : endDate.toISOString().split('T')[0]
                    }
                    onChange={(e) => {
                      const selectedDateStr = e.target.value;
                      if (!selectedDateStr) return;
                      
                      // Create a new date object from the input value
                      const parts = selectedDateStr.split('-');
                      const year = parseInt(parts[0], 10);
                      const month = parseInt(parts[1], 10) - 1; // months are 0-indexed
                      const day = parseInt(parts[2], 10);
                      
                      const selectedDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
                      
                      // Check if date is valid
                      if (isNaN(selectedDate.getTime())) {
                        return;
                      }
                      
                      // Get today's date with time set to end of day
                      const today = new Date();
                      today.setHours(23, 59, 59, 999);
                      
                      if (datePickerMode === 'start') {
                        // Only check that it's not after today
                        if (selectedDate > today) {
                          platformAlert('Invalid Date Range', 'Start date cannot be in the future.');
                          return;
                        }
                        
                        // If start date is after current end date, update end date too
                        if (selectedDate > endDate) {
                          setEndDate(selectedDate);
                        }
                        
                        setStartDate(selectedDate);
                      } else {
                        // For end date, check against start date
                        if (selectedDate < startDate) {
                          platformAlert('Invalid Date Range', 'End date cannot be before start date.');
                          return;
                        }
                        
                        if (selectedDate > today) {
                          platformAlert('Invalid Date Range', 'End date cannot be in the future.');
                          return;
                        }
                        
                        setEndDate(selectedDate);
                      }
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    style={styles.webDatePicker}
                  />
                  
                  <View style={styles.datePickerButtonsContainer}>
                    <Button
                      title="Cancel"
                      onPress={() => setShowDatePicker(false)}
                      type="outline"
                      style={styles.datePickerButton}
                    />
                    <Button
                      title={datePickerMode === 'start' ? 'Next' : 'Done'}
                      onPress={() => {
                        if (datePickerMode === 'start') {
                          setDatePickerMode('end');
                        } else {
                          // Double-check that end date is not before start date
                          if (endDate < startDate) {
                            setEndDate(startDate);
                          }
                          
                          setShowDatePicker(false);
                          // Force refresh with new date range
                          setTimeout(() => {
                            loadHistoryData();
                          }, 100);
                        }
                      }}
                      style={styles.datePickerButton}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.metrics.spacing.medium,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.metrics.spacing.small,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.metrics.spacing.large,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.metrics.spacing.small,
    paddingHorizontal: theme.metrics.spacing.medium,
    borderRadius: theme.metrics.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    minWidth: '22%',
  },
  metricButtonText: {
    fontSize: theme.fonts.sizes.small,
    marginLeft: theme.metrics.spacing.tiny,
    color: theme.colors.text,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButton: {
    flex: 1,
    paddingVertical: theme.metrics.spacing.small,
    paddingHorizontal: theme.metrics.spacing.tiny,
    borderRadius: theme.metrics.borderRadius.medium,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.metrics.spacing.tiny,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedTimeButton: {
    backgroundColor: theme.colors.primary,
  },
  timeButtonText: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.text,
  },
  selectedTimeButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  customDateContainer: {
    marginTop: theme.metrics.spacing.medium,
    alignItems: 'center',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.metrics.spacing.small,
    borderRadius: theme.metrics.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  dateRangeText: {
    color: theme.colors.primary,
    marginLeft: theme.metrics.spacing.small,
    fontSize: theme.fonts.sizes.medium,
  },
  chartCard: {
    marginVertical: theme.metrics.spacing.medium,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: theme.metrics.spacing.medium,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.metrics.spacing.large,
  },
  noDataText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.metrics.spacing.medium,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginTop: theme.metrics.spacing.small,
    textAlign: 'center',
  },
  dataPointsContainer: {
    width: '100%',
    marginTop: theme.metrics.spacing.medium,
  },
  dataPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.metrics.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dataDate: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.text,
  },
  dataValue: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: 'bold',
  },
  statsCard: {
    marginBottom: theme.metrics.spacing.large,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fonts.sizes.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.metrics.spacing.tiny,
  },
  statValue: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.metrics.spacing.medium,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.metrics.borderRadius.medium,
    width: '90%',
    maxWidth: 400,
    padding: theme.metrics.spacing.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.metrics.spacing.small,
  },
  modalTitle: {
    fontSize: theme.fonts.sizes.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  datePicker: {
    width: '100%',
  },
  datePickerButton: {
    marginTop: theme.metrics.spacing.medium,
  },
  webDatePickerContainer: {
    padding: theme.metrics.spacing.medium,
    alignItems: 'center',
  },
  webDatePicker: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius.small,
    marginBottom: theme.metrics.spacing.medium,
    padding: theme.metrics.spacing.small,
  },
  datePickerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default HistoryScreen;