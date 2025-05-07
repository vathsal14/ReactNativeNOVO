import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const CustomTabBar = ({ state, descriptors, navigation }) => {
  if (!state) {
    // Handle the case when state is undefined
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          })
        }

        // Determine which icon to show based on route name
        const getIcon = (routeName, isFocused) => {
          const color = isFocused ? "#1a73e8" : "#757575"
          const size = 24

          switch (routeName) {
            case "Home":
              return <Icon name="home" size={size} color={color} />
            case "Patients":
              return <Icon name="account-group" size={size} color={color} />
            case "Appointments":
              return <Icon name="calendar" size={size} color={color} />
            case "Notifications":
              return <Icon name="bell" size={size} color={color} />
            case "Settings":
              return <Icon name="cog" size={size} color={color} />
            default:
              return <Icon name="home" size={size} color={color} />
          }
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            {getIcon(route.name, isFocused)}
            <Text style={[styles.tabLabel, { color: isFocused ? "#1a73e8" : "#757575" }]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    height: 60,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
})

export default CustomTabBar;
