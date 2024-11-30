import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import useBLE from './lib/ble';

export default function App() {
  const { color } = useBLE();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <Text>Ble Solution!</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
