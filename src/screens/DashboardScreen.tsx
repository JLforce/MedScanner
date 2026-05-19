import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


interface DashboardScreenProps {
  navigation: {
    replace: (screen: string) => void;
    goToScan?: () => void;
  };
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Dashboard!</Text>
      <Text style={styles.subtitle}>You are now logged in.</Text>
      <Button title="SCAN" onPress={() => navigation.goToScan && navigation.goToScan()} />
      <Button title="Log out" onPress={() => navigation.replace('login')} color="#888" />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
  },
});

export default DashboardScreen;
