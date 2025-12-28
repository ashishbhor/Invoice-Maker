import React, { useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';


type ClientDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ClientDetails'>;
type RouteProps = RouteProp<RootStackParamList, 'ClientDetails'>;

interface Props {
  navigation: ClientDetailsNavigationProp;
  route: RouteProps;
}
const ClientDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const mode = route.params?.mode ?? 'invoice';

  const { currentInvoice, updateClientDetails, finalizeInvoice } = useInvoice();
  
  const [name, setName] = useState(currentInvoice.client?.name || '');
  const [phone, setPhone] = useState(currentInvoice.client?.phone || '');
  const [eventDate, setEventDate] = useState(new Date(currentInvoice.client?.eventDate || Date.now()));
  const [dateIssued, setDateIssued] = useState(new Date(currentInvoice.client?.dateIssued || Date.now()));

  const [showEventPicker, setShowEventPicker] = useState(false);
  const [showIssuedPicker, setShowIssuedPicker] = useState(false);
  const [advance, setAdvance] = useState('');


  const onChangeEventDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEventPicker(Platform.OS === 'ios');
    if (selectedDate) setEventDate(selectedDate);
  };

  const onChangeIssuedDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowIssuedPicker(Platform.OS === 'ios');
    if (selectedDate) setDateIssued(selectedDate);
  };

  const handleNext = () => {
    // Validation
    if (!name.trim() || !/^[a-zA-Z\s]*$/.test(name)) {
      Alert.alert("Invalid Name", "Name must contain letters only.");
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      Alert.alert("Invalid Phone", "Phone must be exactly 10 digits.");
      return;
    }

    updateClientDetails({
      name,
      phone,
      eventDate: mode === 'invoice' ? eventDate.toISOString() : undefined,
      dateIssued: mode === 'invoice' ? dateIssued.toISOString() : undefined,
      advance: advance ? Number(advance) : 0
    });

    // finalizeInvoice();
    navigation.navigate('Preview', { mode });
  };

  return (
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Client Details</Text>
      
      <TextInput
        label="Client Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      
      <TextInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        mode="outlined"
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
      />

      {mode === 'invoice' && (
        <>
    {/* Event Date */}
    <TouchableOpacity onPress={() => setShowEventPicker(true)} style={styles.dateContainer}>
      <Text variant="bodyMedium" style={styles.label}>Event Date</Text>
      <Text variant="bodyLarge">{eventDate.toLocaleDateString()}</Text>
    </TouchableOpacity>

    {showEventPicker && (
      <DateTimePicker
        value={eventDate}
        mode="date"
        display="default"
        onChange={onChangeEventDate}
      />
    )}

    {/* Date Issued */}
    <TouchableOpacity onPress={() => setShowIssuedPicker(true)} style={styles.dateContainer}>
      <Text variant="bodyMedium" style={styles.label}>Date Issued</Text>
      <Text variant="bodyLarge">{dateIssued.toLocaleDateString()}</Text>
    </TouchableOpacity>

    {showIssuedPicker && (
      <DateTimePicker
        value={dateIssued}
        mode="date"
        display="default"
        onChange={onChangeIssuedDate}
      />
    )}
  </>
)}

        
      <TextInput
        label="Advance Paid (optional)"
        keyboardType="numeric"
        value={advance}
        onChangeText={setAdvance}
        />
      
      <Button mode="contained" onPress={handleNext} style={styles.button}>
        {mode === 'invoice' ? 'Generate Invoice' : 'Generate Quotation'}
      </Button>
      </View>
    </SafeAreaView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#22313f'
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  label: {
    color: '#666',
    marginBottom: 5
  },
  button: {
    marginTop: 20,
    backgroundColor: '#22313f'
  }
});

export default ClientDetailsScreen;
