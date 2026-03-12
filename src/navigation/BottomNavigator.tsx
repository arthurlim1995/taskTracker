import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ClipboardCheck, House} from 'lucide-react-native';
import TaskList from '../screen/task/Task';
import HomePage from '../screen/home/Home';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform} from 'react-native';

interface IconType {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const insets = useSafeAreaInsets();

  const homeIcon = ({focused, color, size}: IconType) => {
    return <House size={size} color={focused ? '#E206EA' : color} />;
  };

  const taskIcon = ({focused, color, size}: IconType) => {
    return <ClipboardCheck size={size} color={focused ? '#E206EA' : color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: Platform.OS === 'android' ? 10 : insets.bottom / 2,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          //   tabBarIcon: ({focused, color, size}) => (
          //     <House size={size} color={focused ? '#E206EA' : color} />
          //   ),
          tabBarIcon: homeIcon,
        }}
      />

      <Tab.Screen
        name="Tasks"
        component={TaskList}
        options={{
          //   tabBarIcon: ({focused, color, size}) => (
          //     <CheckSquare size={size} color={focused ? '#E206EA' : color} />
          //   ),
          tabBarIcon: taskIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
