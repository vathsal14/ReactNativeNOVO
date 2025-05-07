import { View, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const TabIcon = ({ name, focused, size = 24 }) => {
  // Map the tab names to their respective icons
  const getIconName = () => {
    switch (name) {
      case 'Patients':
        return 'user-friends';
      case 'Dashboard':
        return 'th-large';
      case 'Schedule':
        return 'calendar-alt';
      case 'Profile':
        return 'user';
      default:
        return 'circle';
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name={getIconName()} size={size} color={focused ? '#4169E1' : '#888'} solid={focused} />
      {focused && <View style={styles.indicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: -12,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4169E1',
  },
});

export default TabIcon;

