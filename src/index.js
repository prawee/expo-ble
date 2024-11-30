import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import useBLE from './lib/ble';
import DeviceModal from './components/device-modal';

export default function App() {
  const { color, connectedDevice, requirePermissions, scanForPeripherals, connectToDevice, allDevices } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scanForDevices = async() => {
    console.log("scanForDevices is called. ", isModalVisible);
    const isPermissionsEnabled = await requirePermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    console.log("hideModal is called. ", isModalVisible);
    setIsModalVisible(false);
  };
  
  const openModal = () => {
    console.log("openModal is called. ", isModalVisible);
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <Text style={styles.heartRateTitleText}>Connected</Text>
        ) : (
          <Text style={styles.heartRateTitleText}>Please connect the Arduino</Text>
        )}
      </View>
      <TouchableOpacity style={styles.connectButton} onPress={openModal}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
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
  connectButton: {
    backgroundColor: "#ff6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  connectButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold", 
  },
});
