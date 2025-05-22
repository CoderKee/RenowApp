import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabs from "./MainTabs";
import ItemDetails from "./homeTabs/ItemDetails";

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
            </Stack.Navigator>
        
    )

}

export default RootNavigator