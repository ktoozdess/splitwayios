import React from "react";
import Welcome from "./components/View/Welcome";
import Homepage from "./components/View/Homepage";
import GroupItem from "./components/GroupItem";
import Feedpage from "./components/View/Feedpage";
import Creategroup from "./components/View/Creategroup";
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {Firebase_auth } from './firebase/config';
import VotePage from "./components/View/VotePage";
import { Easing, Animated } from 'react-native';
import { createStackNavigator,TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AddMember from "./components/AddMember";
import ExpenseView from "./components/View/ExpenseView";

const Stack = createStackNavigator();

export default function Navigate(){
    const [user, setUser] = useState(User);

    function customTransition({ current }) {
        return {
          cardStyle: {
            opacity: current.progress,
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        };
      }
    useEffect(() =>{
      onAuthStateChanged (Firebase_auth, (user) => {
        setUser(user)
      })
    }, [])
    return(
<NavigationContainer >
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
            gestureEnabled: true,
        //   ...TransitionPresets.ModalSlideFromBottomIOS, // Используем SlideFromRightIOS эффект
        transitionSpec: {
            open: { animation: 'timing', config: { duration: 300, easing: Easing.inOut(Easing.ease) } },
            close: { animation: 'timing', config: { duration: 200, easing: Easing.inOut(Easing.ease) } },
          },
          cardStyleInterpolator: customTransition,
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
                options={{title: 'Feedpage',
                ...TransitionPresets.DefaultTransition,
            }}
            />
            <Stack.Screen 
                name="Creategroup"
                component={Creategroup}
                options={{title: 'Creategroup',
                ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
            />
            <Stack.Screen 
                name="VotePage"
                component={VotePage}
                options={{title: 'VotePage'}}
            />
            <Stack.Screen 
                name="AddMember"
                component={AddMember}
                options={{title: 'AddMember',
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
            <Stack.Screen 
                name="ExpenseView"
                component={ExpenseView}
                options={{title: 'ExpenseView',
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
            
        </Stack.Navigator>
    </NavigationContainer>
    ) 
    
}