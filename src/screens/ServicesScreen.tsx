import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Button, Text, Card, IconButton, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList, EventCard, ServiceItem } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { generateId } from '../utils/uuid';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'Services'
>;

type RouteProps = RouteProp<
  RootStackParamList,
  'Services'
>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

const DEFAULT_SERVICES = [
  "Traditional Photo",
  "Traditional Video",
  "Photo's",
  "Video's",
  "Video Edit",
  "Photo Edit",
  "Reel",
  "Drone Shoot",
  "Cinematic Shot",
  "Album",
  "Travelling Charges",
  "Pendrive Charges"
];

const ServicesScreen: React.FC<Props> = ({ navigation, route }) => {
  const mode = route.params?.mode ?? 'invoice';
  console.log('FLOW MODE (Services):', mode);

  const { currentInvoice, updateEvents } = useInvoice();
  const [eventsData, setEventsData] = useState<EventCard[]>(
    currentInvoice.events || []
  );

  const addServiceRow = (eventIndex: number) => {
    const updated = [...eventsData];
    updated[eventIndex].services.push({
      id: generateId(),
      name: DEFAULT_SERVICES[0],
      amount: 0,
    });
    setEventsData(updated);
  };

  const removeServiceRow = (eventIndex: number, serviceIndex: number) => {
    const updated = [...eventsData];
    updated[eventIndex].services.splice(serviceIndex, 1);
    setEventsData(updated);
  };

  const updateServiceField = (
    eventIndex: number,
    serviceIndex: number,
    field: keyof ServiceItem,
    value: any
  ) => {
    const updated = [...eventsData];
    // @ts-ignore
    updated[eventIndex].services[serviceIndex][field] = value;
    setEventsData(updated);
  };

  const handleNext = () => {
    for (const event of eventsData) {
      for (const service of event.services) {
        if (!service.amount || service.amount <= 0) {
          Alert.alert(
            'Invalid Amount',
            `Enter valid amount for ${service.name}`
          );
          return;
        }
      }
    }

    updateEvents(eventsData);

    navigation.navigate('ClientDetails', { mode });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.header}>
          Select Services
        </Text>

        <ScrollView>
          {eventsData.map((event, eventIndex) => (
            <Card key={event.id} style={styles.card}>
              <Card.Title title={event.eventType} />
              <Card.Content>
                {event.services.map((service, serviceIndex) => (
                  <View key={service.id} style={styles.row}>
                    <Picker
                      selectedValue={service.name}
                      onValueChange={(val) =>
                        updateServiceField(
                          eventIndex,
                          serviceIndex,
                          'name',
                          val
                        )
                      }
                      style={{ flex: 2 }}
                    >
                      {DEFAULT_SERVICES.map(s => (
                        <Picker.Item key={s} label={s} value={s} />
                      ))}
                    </Picker>

                    <TextInput
                      mode="outlined"
                      label="₹"
                      keyboardType="number-pad"
                      value={service.amount ? String(service.amount) : ''}
                      onChangeText={(t) =>
                        updateServiceField(
                          eventIndex,
                          serviceIndex,
                          'amount',
                          Number(t)
                        )
                      }
                      style={{ flex: 1 }}
                    />

                    <IconButton
                      icon="delete"
                      onPress={() =>
                        removeServiceRow(eventIndex, serviceIndex)
                      }
                    />
                  </View>
                ))}

                <Button onPress={() => addServiceRow(eventIndex)}>
                  + Add Service
                </Button>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <Button mode="contained" onPress={handleNext}>
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25 },
  header: { fontWeight: 'bold', marginBottom: 40 },
  card: { marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default ServicesScreen;
