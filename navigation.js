import React from "react";
import Welcome from "./components/View/Welcome";
import Homepage from "./components/View/Homepage";
import GroupItem from "./components/GroupItem";
import Feedpage from "./components/View/Feedpage";
import Creategroup from "./components/View/Creategroup";
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {Firebase_auth } from './firebase/config';
import GroupPaymentsScreen from "./components/View/text";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Navigate(){
    const [user, setUser] = useState(User);

    useEffect(() =>{
      onAuthStateChanged (Firebase_auth, (user) => {
        setUser(user)
      })
    }, [])
    return(
<NavigationContainer >
        <Stack.Navigator
        screenOptions={{
            headerShown: false
          }}
        >
            {user ? (
                <Stack.Screen 
                name="Home"
                component={Homepage}
                options={{title: 'Homepage'}}
            />
            ) : (
                <Stack.Screen 
                name="Main"
                component={Welcome}
                options={{title: 'main'}}
            />
            )}
            <Stack.Screen 
                name="GroupItem"
                component={GroupItem}
                options={{title: 'GroupItem'}}
            />
            <Stack.Screen 
                name="Feedpage"
                component={Feedpage}
                options={{title: 'Feedpage'}}
            />
            <Stack.Screen 
                name="Creategroup"
                component={Creategroup}
                options={{title: 'Creategroup'}}
            />
            <Stack.Screen 
                name="GroupPaymentsScreen"
                component={GroupPaymentsScreen}
                options={{title: 'GroupPaymentsScreen'}}
            />
           
        </Stack.Navigator>
    </NavigationContainer>
    ) 
    
}