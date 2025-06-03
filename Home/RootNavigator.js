import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./MainTabs";
import ItemDetails from "./homeTabs/ItemDetails";
import EditScreen from "./components/EditScreen";
import CompletedRequest from "./profileTabs/CompletedListing";

const Stack = createStackNavigator();

const RootNavigator = ({ route }) => {
    const { username } = route.params;
    
    return (
       
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={MainTabs}
                    initialParams={{ username }}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ItemDetails"
                    component={ItemDetails}
                    params={{ username }}
                    options={{ title: 'Details' }}
                />
                <Stack.Screen
                    name="EditScreen"
                    component={EditScreen}
                    options={{ title: 'Edit Listing' }}
                />
                <Stack.Screen
                    name="CompletedListing"
                    component={CompletedRequest}
                    options={{ title: 'Completed Listing' }}
                />
            </Stack.Navigator>
        
    )

}

export default RootNavigator