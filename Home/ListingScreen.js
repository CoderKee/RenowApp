import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AcceptedListing from './listingTabs/AcceptedListing';
import CompletedRequest from './listingTabs/CompletedRequest';
import MyListing from './listingTabs/MyListing';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';

const topTab = createMaterialTopTabNavigator();

const ListingScreen = ({username, navigation, route}) => {
  const initialRouteName = route?.params?.screen || 'My Listing';
  return (
    <topTab.Navigator initialRouteName={initialRouteName}>
      <topTab.Screen name="My Listing" component={MyListing}/>        
      <topTab.Screen name="Accepted Listing" component={AcceptedListing}/>
      <topTab.Screen name="Completed Listing" component={CompletedRequest}/>
    </topTab.Navigator>
  );
};

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});
