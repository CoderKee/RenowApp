import { StyleSheet, Text, View, Modal, Pressable } from 'react-native'
import React from 'react'

const AlertModal = ({visible, onCancel, onConfirm, alertText, confirmOption}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel} 
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{alertText}</Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>{confirmOption}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AlertModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 25,
        textAlign: 'center',
        color: 'black',
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: '#ccc',
    },
    deleteButton: {
      backgroundColor: 'maroon',
    },
    buttonText: {
      fontWeight: 'bold',
    },
})