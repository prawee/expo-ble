import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";

const bleManager = new BleManager();

const DATA_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";  //6e400001-b5a3-f393-e0a9-e50e24dcca9e
const COLOR_CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1217";

function useBLE() {
    const [allDevices, setAllDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [color, setColor] = useState("white");

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: "Location Permission",
                message: "This app requires access to Location",
                buttonPositive: "OK",
            }
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: "Location Permission",
                message: "This app requires access to Location",
                buttonPositive: "OK",
            }
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "This app requires access to Location",
                buttonPositive: "OK",
            }
        );

        return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app requires access to location",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionGranted;
            }
        } else {
            return true;
        }
    };

    const connectToDevice = async (device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const isDuplicateDevice = (devices, nextDevice) => {
        return devices.findIndex((device) => nextDevice.id === device.id) > -1;
    };

    const scanForPeripherals = () => {
        return bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            };

            if (device && (device.localName === "Arduino" || device.name === "Arduino")) {
                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });
    };

    const onDataUpdate = (error, characteristic) => {
        if (error) {
            console.log(error);
            return;
        } else if (!characteristic?.value) {
            console.log("No Data was received");
            return;
        }

        const colorCode = base64.decode(characteristic.value);

        let color = "white";
        if (colorCode === "B") {
            color = "blue";
        } else if (colorCode === "R") {
            color = "red";
        } else if (colorCode === "G") {
            color = "green";
        }
        setColor(color);
    }

    const startStreamingData = (device) => {
        if (device) {
            device.monitorCharacteristicsForService(
                DATA_SERVICE_UUID,
                COLOR_CHARACTERISTIC_UUID,
                onDataUpdate
            );
        } else {
            console.log("No Device Connected");
        }
    };

    return {
        requestPermissions,
        allDevices,
        color,
        connectToDevice,
        scanForPeripherals,
        startStreamingData,
        connectedDevice,
    };
}

export default useBLE;