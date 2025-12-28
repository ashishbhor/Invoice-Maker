import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { useInvoice } from '../context/InvoiceContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { startNewInvoice } = useInvoice();

  const handleCreateBill = () => {
    startNewInvoice();
    navigation.navigate('EventSelection', { mode: 'invoice' });
  };

  const handleCreateQuotation = () => {
    startNewInvoice(); // reuse same invoice state (SAFE)
    navigation.navigate('EventSelection', { mode: 'quotation' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            GP STUDIO
          </Text>
          <Text style={styles.owner}>
            BhorBox
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.content}>
          <Button
            mode="contained"
            onPress={handleCreateBill}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.primaryLabel}
          >
            Create Bill
          </Button>

          <Button 
            mode="outlined" 
            onPress={handleCreateQuotation} 
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.primaryLabel}
          >
            Create Quotation
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('History')}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.secondaryLabel}
          >
            History
          </Button>
        </View>

      </View>
    </SafeAreaView>
  );
};

const PRIMARY = '#22313f';
const BACKGROUND = '#ffffff';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BACKGROUND,
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    color: PRIMARY,
    letterSpacing: 0.8,
  },
  owner: {
    marginTop: 25,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContent: {
    height: 56,
  },
  primaryButton: {
    borderRadius: 10,
    backgroundColor: PRIMARY,
    marginBottom: 16,
  },
  primaryLabel: {
    fontSize: 18,
    color: '#fff',
  },
  secondaryButton: {
    borderRadius: 10,
    borderColor: PRIMARY,
  },
  secondaryLabel: {
    fontSize: 18,
    color: PRIMARY,
  },
});

export default HomeScreen;
