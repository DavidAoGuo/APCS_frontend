// File: src/screens/main/ScheduleScreen.js
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Loading } from '../../components/common';
import { createSchedule, deleteSchedule, getSchedules, toggleSchedule } from '../../store/actions/scheduleActions';
import { theme } from '../../theme';
import platformAlert from '../../utils/platformAlert';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleScreen = () => {
  const dispatch = useDispatch();
  const { schedules, loading } = useSelector(state => state.schedules);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    type: 'food',
    time: new Date(),
    days: [...daysOfWeek],
    amount: 50,
    enabled: true
  });
  
  // Fetch schedules when component mounts
  useEffect(() => {
    dispatch(getSchedules());
  }, [dispatch]);
  
  const handleToggleSchedule = (id, enabled) => {
    dispatch(toggleSchedule(id, !enabled));
  };
  
  const handleDeleteSchedule = (id) => {
    platformAlert(
      'Delete Schedule',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteSchedule(id));
          } 
        },
      ]
    );
  };
  
  const handleCreateSchedule = () => {
    // Format time to HH:MM
    const hours = String(newSchedule.time.getHours()).padStart(2, '0');
    const minutes = String(newSchedule.time.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const scheduleData = {
      type: newSchedule.type,
      time: timeString,
      days: newSchedule.days,
      amount: newSchedule.amount,
      enabled: newSchedule.enabled
    };
    
    dispatch(createSchedule(scheduleData))
      .then(() => {
        setShowAddModal(false);
        // Reset form
        setNewSchedule({
          type: 'food',
          time: new Date(),
          days: [...daysOfWeek],
          amount: 50,
          enabled: true
        });
      })
      .catch(error => {
        platformAlert('Error', error.message);
      });
  };
  
  const renderDays = (days) => {
    // Convert full day names to abbreviations
    const abbreviations = {
      'Monday': 'Mon', 
      'Tuesday': 'Tue', 
      'Wednesday': 'Wed', 
      'Thursday': 'Thu', 
      'Friday': 'Fri', 
      'Saturday': 'Sat', 
      'Sunday': 'Sun'
    };
    
    return days.map(day => abbreviations[day] || day).join(', ');
  };
  
  const toggleDay = (day) => {
    if (newSchedule.days.includes(day)) {
      // Remove day if already selected
      setNewSchedule({
        ...newSchedule,
        days: newSchedule.days.filter(d => d !== day)
      });
    } else {
      // Add day if not selected
      setNewSchedule({
        ...newSchedule,
        days: [...newSchedule.days, day]
      });
    }
  };
  
  // Format schedule time from "HH:MM" to "8:00 AM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    
    return `${formattedHour}:${String(minute).padStart(2, '0')} ${period}`;
  };
  
  return (
    <ScrollView style={styles.scrollView}>
      {loading && <Loading fullscreen />}
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Feeding Schedule</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subtitle}>Automate your pet feeding and watering times</Text>
        
        {schedules.length === 0 ? (
          <Card>
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={50} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No schedules yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to add a new schedule</Text>
            </View>
          </Card>
        ) : (
          schedules.map(schedule => (
            <Card key={schedule._id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleTypeContainer}>
                  <Ionicons 
                    name={schedule.type === 'food' ? 'restaurant-outline' : 'water-outline'} 
                    size={20} 
                    color={schedule.type === 'food' ? theme.colors.primary : theme.colors.secondary} 
                  />
                  <Text style={[
                    styles.scheduleType,
                    { color: schedule.type === 'food' ? theme.colors.primary : theme.colors.secondary }
                  ]}>
                    {schedule.type === 'food' ? 'Food' : 'Water'}
                  </Text>
                </View>
                
                <View style={styles.scheduleControls}>
                  <TouchableOpacity 
                    style={styles.scheduleControl}
                    onPress={() => handleToggleSchedule(schedule._id, schedule.enabled)}
                  >
                    <Ionicons 
                      name={schedule.enabled ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                      size={24} 
                      color={schedule.enabled ? theme.colors.success : theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.scheduleControl}
                    onPress={() => handleDeleteSchedule(schedule._id)}
                  >
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.scheduleDetails}>
                <View style={styles.scheduleTime}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.scheduleTimeText}>{formatTime(schedule.time)}</Text>
                </View>
                
                <View style={styles.scheduleDays}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.scheduleDaysText}>{renderDays(schedule.days)}</Text>
                </View>
                
                <View style={styles.scheduleAmount}>
                  <Ionicons name="stats-chart-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.scheduleAmountText}>Amount: {schedule.amount}%</Text>
                </View>
              </View>
              
              <View style={styles.scheduleStatus}>
                <Text style={[
                  styles.scheduleStatusText,
                  { color: schedule.enabled ? theme.colors.success : theme.colors.textSecondary }
                ]}>
                  {schedule.enabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </Card>
          ))
        )}
      </View>
      
      {/* Add Schedule Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Schedule</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {/* Schedule Type */}
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newSchedule.type}
                onValueChange={(value) => setNewSchedule({...newSchedule, type: value})}
                style={styles.picker}
              >
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Water" value="water" />
              </Picker>
            </View>
            
            {/* Time Picker */}
            <Text style={styles.formLabel}>Time</Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={newSchedule.time}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setNewSchedule({...newSchedule, time: date});
                  }
                }}
                style={styles.datePicker}
              />
            ) : Platform.OS === 'android' ? (
              <View style={styles.androidTimePickerContainer}>
                <Button
                  title={`Select Time: ${newSchedule.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  onPress={() => {
                    // On Android, we need to show the picker differently
                    setShowTimePicker(true);
                  }}
                  type="outline"
                />
                {showTimePicker && (
                  <DateTimePicker
                    value={newSchedule.time}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={(event, date) => {
                      setShowTimePicker(false);
                      if (date && event.type !== 'dismissed') {
                        setNewSchedule({...newSchedule, time: date});
                      }
                    }}
                  />
                )}
              </View>
            ) : (
              // Web platform
              <View style={styles.webTimePickerContainer}>
                <input
                  type="time"
                  value={`${String(newSchedule.time.getHours()).padStart(2, '0')}:${String(newSchedule.time.getMinutes()).padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newTime = new Date();
                    newTime.setHours(hours);
                    newTime.setMinutes(minutes);
                    setNewSchedule({...newSchedule, time: newTime});
                  }}
                  style={styles.webTimePicker}
                />
              </View>
            )}
            
            {/* Days Picker */}
            <Text style={styles.formLabel}>Days</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map(day => (
                <CheckBox
                  key={day}
                  title={day.substring(0, 3)}
                  checked={newSchedule.days.includes(day)}
                  onPress={() => toggleDay(day)}
                  containerStyle={styles.dayCheckBox}
                  textStyle={styles.dayCheckBoxText}
                  checkedColor={theme.colors.primary}
                />
              ))}
            </View>
            
            {/* Amount */}
            <Text style={styles.formLabel}>Amount (%)</Text>
            <TextInput
              style={styles.textInput}
              value={String(newSchedule.amount)}
              onChangeText={(text) => {
                const amount = parseInt(text) || 0;
                setNewSchedule({...newSchedule, amount: Math.min(100, Math.max(0, amount))});
              }}
              keyboardType="numeric"
              placeholder="Enter amount (1-100)"
            />
            
            {/* Enabled */}
            <CheckBox
              title="Enable Schedule"
              checked={newSchedule.enabled}
              onPress={() => setNewSchedule({...newSchedule, enabled: !newSchedule.enabled})}
              containerStyle={styles.enabledCheckBox}
              checkedColor={theme.colors.primary}
            />
            
            {/* Submit Button */}
            <Button 
              title="Add Schedule" 
              onPress={handleCreateSchedule} 
              style={styles.submitButton}
              disabled={
                newSchedule.days.length === 0 || 
                newSchedule.amount <= 0 || 
                newSchedule.amount > 100
              }
            />
          </View>
        </View>
      </Modal>
      
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.small,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.metrics.spacing.tiny,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.metrics.spacing.large,
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
  scheduleCard: {
    marginBottom: theme.metrics.spacing.medium,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.medium,
  },
  scheduleTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleType: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: 'bold',
    marginLeft: theme.metrics.spacing.tiny,
  },
  scheduleControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleControl: {
    marginLeft: theme.metrics.spacing.medium,
  },
  scheduleDetails: {
    marginBottom: theme.metrics.spacing.medium,
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.small,
  },
  scheduleTimeText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.metrics.spacing.small,
  },
  scheduleDays: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.small,
  },
  scheduleDaysText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.metrics.spacing.small,
  },
  scheduleAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleAmountText: {
    fontSize: theme.fonts.sizes.medium,
    color: theme.colors.text,
    marginLeft: theme.metrics.spacing.small,
  },
  scheduleStatus: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.metrics.spacing.small,
  },
  scheduleStatusText: {
    fontSize: theme.fonts.sizes.small,
    fontWeight: 'bold',
  },
  // Modal styles
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
    width: '100%',
    maxWidth: 500,
    padding: theme.metrics.spacing.medium,
    maxHeight: '90%',
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
  formLabel: {
    fontSize: theme.fonts.sizes.medium,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.metrics.spacing.small,
    marginTop: theme.metrics.spacing.medium,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius.small,
    marginBottom: theme.metrics.spacing.medium,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePicker: {
    width: '100%',
  },
  androidTimePickerContainer: {
    marginVertical: theme.metrics.spacing.medium,
  },
  webTimePickerContainer: {
    marginVertical: theme.metrics.spacing.medium,
  },
  webTimePicker: {
    padding: theme.metrics.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius.small,
    width: '100%',
    fontSize: theme.fonts.sizes.medium,
    height: 40,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.metrics.spacing.medium,
  },
  dayCheckBox: {
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dayCheckBoxText: {
    fontSize: theme.fonts.sizes.small,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.metrics.borderRadius.small,
    padding: theme.metrics.spacing.small,
    fontSize: theme.fonts.sizes.medium,
    marginBottom: theme.metrics.spacing.medium,
  },
  enabledCheckBox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.metrics.spacing.medium,
  },
  submitButton: {
    marginTop: theme.metrics.spacing.medium,
  },
});

export default ScheduleScreen;