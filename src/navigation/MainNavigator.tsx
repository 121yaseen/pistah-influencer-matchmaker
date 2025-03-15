import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Import screens
import DiscoverScreen from '../screens/main/DiscoverScreen';
import MatchesScreen from '../screens/main/MatchesScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import {MainStackParamList} from './types';
import CustomIcon from '../components/CustomIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<MainStackParamList>();

// Custom back button component
const CustomBackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <CustomIcon name="arrow-left" size={24} color="#000" />
    </TouchableOpacity>
  );
};

// Move TabIcon component outside of render
const TabIcon = ({name, focused}: {name: string; focused: boolean}) => (
  <CustomIcon name={name} size={24} color={focused ? '#007AFF' : '#999999'} />
);

// Create tab icon components for each tab
const DiscoverTabIcon = ({focused}: {focused: boolean}) => (
  <TabIcon name="compass" focused={focused} />
);

const MatchesTabIcon = ({focused}: {focused: boolean}) => (
  <TabIcon name="heart" focused={focused} />
);

const MessagesTabIcon = ({focused}: {focused: boolean}) => (
  <TabIcon name="message" focused={focused} />
);

const ProfileTabIcon = ({focused}: {focused: boolean}) => (
  <TabIcon name="account" focused={focused} />
);

// Profile Stack Navigator
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

// Move tab components outside of MainNavigator with proper navigation props
const DiscoverTab = () => {
  return (
    <View style={styles.tabContainer}>
      <DiscoverScreen />
    </View>
  );
};

const MatchesTab = () => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackParamList, 'Matches'>>();
  return (
    <View style={styles.tabContainer}>
      <MatchesScreen navigation={navigation} />
    </View>
  );
};

const MessagesTab = () => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackParamList, 'Messages'>>();
  return (
    <View style={styles.tabContainer}>
      <MessagesScreen navigation={navigation} />
    </View>
  );
};

const ProfileTab = () => {
  return (
    <View style={styles.tabContainer}>
      <ProfileStack />
    </View>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        headerLeft: () => <CustomBackButton />,
      }}>
      <Tab.Screen
        name="Discover"
        component={DiscoverTab}
        options={{
          tabBarIcon: DiscoverTabIcon,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesTab}
        options={{
          tabBarIcon: MatchesTabIcon,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesTab}
        options={{
          tabBarIcon: MessagesTabIcon,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarIcon: ProfileTabIcon,
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
  },
});

export default MainNavigator;
