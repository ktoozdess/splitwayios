import React from "react";
import Welcome from "./components/Welcome";


import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";



const Stack = createStackNavigator();

export default function Navigate(){
    return(
<NavigationContainer >
        <Stack.Navigator
        screenOptions={{
            headerShown: false
          }}
        >
            <Stack.Screen 
                name="Main"
                component={Welcome}
                options={{title: 'main'}}
            />
           
        </Stack.Navigator>
    </NavigationContainer>
    ) 
    
}