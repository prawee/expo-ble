import { useState } from "react";

function useBLE() {
    const [allDevices, setAllDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [color, setColor] = useState("white");

    const requestPermissions = async () => {
    };

    const connectToDevice = async () => {
    };

    const scanForPeripherals = () => {
    };

    const startStreamingData = () => {
    };

    return {
        requestPermissions,
        allDevices,
        color,
        connectToDevice,
        scanForPeripherals,
        startStreamingData,
    };
}

export default useBLE;