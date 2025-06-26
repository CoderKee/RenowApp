import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ItemReceipt = ({ item, posterUsername }) => {
  function formatDate(timeStamp) {
    const date = new Date(timeStamp);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>
        <Image 
          source={require("../../assets/Renow.png")} 
          style={{ width: 100, height: 100}}
          resizeMode='contain'
        />
        <Text style={{ flex: 1, textAlign: 'left', fontSize: 28, color: 'black', fontWeight: 'bold', marginLeft: 10 }}>
          Proof of Completion
        </Text>
      </View>
      <Text style={{ textAlign: 'flex-start', fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 20 }}>
        Listing title: {item.title}
      </Text>
      <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>
        Price: ${item.price}
      </Text>
      <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginTop: 10}}>
        Listing description:
      </Text>
      <View style={{
        height: 300,
        alignContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
        <Text style={styles.font}>{item.description}</Text>
      </View>
      <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>
        Service received by: {item.request ? posterUsername : item.accepted_by}
      </Text>
      <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>
        Service provided by: {item.request ? item.accepted_by : posterUsername}
      </Text>
      <Text style={{ textAlign: 'flex-start', fontSize: 15, color: 'black', fontWeight: 'bold', marginVertical: 10}}>
        Completed on {formatDate(item.completed_on)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  font: {
    color: 'black',
  }
});

export default ItemReceipt;