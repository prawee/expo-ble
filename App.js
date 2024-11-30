import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import useBLE from './lib/ble';

export default function App() {
  const { color, connectToDevice, connectedDevice } = useBLE();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <Text style={styles.heartRateTitleText}>Connected</Text>
        ) : (
          <Text style={styles.heartRateTitleText}>Please connect the Arduino</Text>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
});
