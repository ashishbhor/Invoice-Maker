import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Text, ActivityIndicator, TextInput } from 'react-native-paper';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { Invoice, RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

type HistoryScreenNavigationProp =
  StackNavigationProp<RootStackParamList, 'History'>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: Invoice[] = [];
      snapshot.forEach(doc => list.push(doc.data() as Invoice));
      setInvoices(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ SEARCH LOGIC (Name OR Invoice ID)
  const filteredInvoices = invoices.filter(inv =>
    inv.client.name.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Preview', {
          invoiceId: item.id,
          readOnly: true,
          mode: 'invoice',
        })
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>{item.client.name}</Text>
          <Text style={styles.invoiceNo}>{item.id}</Text>
          <Text style={styles.amount}>₹{item.total}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.header}>Invoice History</Text>

        <TextInput
          placeholder="Search by name or invoice no"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={styles.search}
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredInvoices}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
            }
            ListEmptyComponent={
              <Text style={styles.empty}>No invoices found</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 20,
    color: '#22313f',
  },
  search: { marginHorizontal: 15, marginBottom: 10 },
  card: {
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  invoiceNo: { color: '#666', marginTop: 4 },
  amount: {
    color: '#3e9c35',
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 16,
  },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
});

export default HistoryScreen;
