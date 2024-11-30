import React, { useCallback } from "react";
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";


const deviceModalItems = (props) => {
    const { item, connectToPeripheral, closeModal } = props;

    const connectAndCloseModal = useCallback(() => {
        connectToPeripheral(item.item);
        closeModal();
    }, [closeModal, connectToPeripheral, item.item]);

    return (
        <TouchableOpacity
            onPress={connectAndCloseModal}
            style={modalStyle.deviceButton}
        >
            <Text style={modalStyle.deviceButtonText}>
                {item.item.name ?? item.item.localName}
            </Text>
        </TouchableOpacity>
    );
};

const deviceModal = (props) => {
    const { devices, visible, connectToPeripheral, closeModal } = props;
    
    const renderDeviceModalListItem = useCallback(
        (item) => {
            console.log('renderDeviceModalListItem ', item);
            return (
                <deviceModalItems
                    item={item}
                    connectToPeripheral={connectToPeripheral}
                    closeModal={closeModal}
                />
            );
        },
        [closeModal, connectToPeripheral]
    );
    
    return (
        <Modal
            style={modalStyle.modalContainer}
            animationType="slide"
            transparent={false}
            visible={visible}
        >
            <SafeAreaView style={modalStyle.modalTitle}>
                <Text style={modalStyle.modalTitleText}>
                    Tap on a device to connect
                </Text>
                <FlatList
                    contentContainerStyle={modalStyle.modalFlatListContainer}
                    data={devices}
                    renderItem={renderDeviceModalListItem}
                />
            </SafeAreaView>
        </Modal>
    );
};

const modalStyle = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    modalTitle: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 20,
    },
    modalFlatListContainer: {
        flex: 1,
        justifyContent: "center",
    },
    deviceButton: {
        backgroundColor: "#ff6060",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    deviceButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    }
});

export default deviceModal;
