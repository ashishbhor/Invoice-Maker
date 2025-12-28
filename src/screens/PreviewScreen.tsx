import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';

import { buildInvoiceHTML } from '../utils/invoiceBuilder';
import { useInvoice } from '../context/InvoiceContext';
import { RootStackParamList, Invoice } from '../types';
import { db } from '../utils/firebaseConfig';

type Props = StackScreenProps<RootStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { finalizeInvoice, buildQuotation } = useInvoice();

  const [htmlContent, setHtmlContent] = useState('');
  const [finalInvoice, setFinalInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const isReadOnly = route.params?.readOnly;
  const mode = route.params?.mode ?? 'invoice';

  useEffect(() => {
    const prepare = async () => {
      let invoice: Invoice;

      // 📂 History
      if (isReadOnly && route.params?.invoiceId) {
        const snap = await getDoc(
          doc(db, 'invoices', route.params.invoiceId)
        );
        invoice = snap.data() as Invoice;
      }
      // 🧾 Invoice
      else if (mode === 'invoice') {
        invoice = await finalizeInvoice();
      }
      // 📄 Quotation
      else {
        invoice = buildQuotation();
      }

      setFinalInvoice(invoice);
      setHtmlContent(buildInvoiceHTML(invoice, mode));
    };

    prepare();
  }, []);

  const handleDownload = async () => {
  if (!htmlContent) return;

  setLoading(true);
  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);

    // Save ONLY invoice (not quotation, not readOnly)
    if (!isReadOnly && finalInvoice && mode === 'invoice') {
      await setDoc(doc(db, 'invoices', finalInvoice.id), {
        ...finalInvoice,
        createdAt: new Date().toISOString(),
      });
    }

    Alert.alert(
      'Success',
      'File ready!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.popToTop(); // ✅ GO BACK TO HOME
          },
        },
      ],
      { cancelable: false }
    );
  } catch {
    Alert.alert('Error', 'Failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {htmlContent ? (
          <WebView
            source={{ html: htmlContent }} />
        ) : (
          <ActivityIndicator style={{ marginTop: 40 }} />
        )}
      </View>

      <View style={styles.footer}>
        {!isReadOnly && mode === 'invoice' && (
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EventSelection', { mode })}
            style={styles.button}
          >
            Edit
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleDownload}
          loading={loading}
          style={styles.button}
        >
          Download & Share
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  button: { width: '48%' },
});

export default PreviewScreen;
