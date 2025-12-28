import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="displayMedium" style={styles.logoText}>GP STUDIO</Text>
      <Text variant="titleMedium" style={styles.subText}>Photography & Cinema</Text>
      <Text style={styles.subText}>BhorBox</Text>
      <ActivityIndicator animating={true} color="#f0932b" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22313f',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subText: {
    color: '#f0932b',
    marginTop: 10,
    letterSpacing: 2,
  },
  loader: {
    marginTop: 30,
  }
});

export default SplashScreen;
