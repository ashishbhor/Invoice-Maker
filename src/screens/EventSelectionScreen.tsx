import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Checkbox, Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, EventCard } from '../types';
import { useInvoice } from '../context/InvoiceContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';


/* ✅ Correct navigation + route types */
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'EventSelection'
>;

type RouteProps = RouteProp<
  RootStackParamList,
  'EventSelection'
>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

const EVENT_TYPES = [
  'Wedding shoot',
  'Pre-wedding shoot',
  'Haldi shoot',
  'Engagement shoot',
  'Baby shower shoot',
  'Portraits shoot',
  'Car delivery shoot',
  'Event shoot',
  'Birthday shoot',
  'Maternity shoot',
  'Portrait shoot',
  'Name Ceremony',
  'Baby Shoot',
  'Annual Function shoot',
  'Annual spots Shoot',
];

const EventSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateEvents, currentInvoice } = useInvoice();

  /* ✅ Read mode safely */
  const mode = route.params?.mode ?? 'invoice';
  console.log('FLOW MODE:', mode);

  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    currentInvoice.events?.map(e => e.eventType) || []
  );

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  const handleNext = () => {
    const newEventCards: EventCard[] = selectedEvents.map(eventType => {
      const existing = currentInvoice.events?.find(
        e => e.eventType === eventType
      );

      return (
        existing || {
          id: Crypto.randomUUID(),
          eventType,
          services: [],
        }
      );
    });

    updateEvents(newEventCards);

    /* ✅ Same flow for invoice & quotation */
    navigation.navigate('Services', { mode });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.header}>
          Select Events
        </Text>

        <ScrollView style={styles.list}>
          {EVENT_TYPES.map(event => (
            <View key={event} style={styles.itemRow}>
              <Checkbox.Android
                status={
                  selectedEvents.includes(event)
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => toggleEvent(event)}
              />
              <Text
                style={styles.itemText}
                onPress={() => toggleEvent(event)}
              >
                {event}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleNext}
            disabled={selectedEvents.length === 0}
            style={styles.button}
          >
            Next
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, fontWeight: 'bold' },
  list: { marginTop: 10 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemText: { fontSize: 16, marginLeft: 8 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: { backgroundColor: '#22313f' },
});

export default EventSelectionScreen;
