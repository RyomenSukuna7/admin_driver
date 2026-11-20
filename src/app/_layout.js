import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const TABS = [
  { name: 'index', href: '/', label: 'Enter', focused: 'create', idle: 'create-outline' },
  { name: 'update', href: '/update', label: 'Update', focused: 'pencil', idle: 'pencil-outline' },
];

function DockTabBar({ state }) {
  const activeName = state.routes[state.index].name;

  return (
    <View style={styles.dock}>
      <View style={styles.pill}>
        {TABS.map((tab) => {
          const focused = activeName === tab.name;
          return (
            <Pressable
              key={tab.name}
              onPress={() => {
                if (!focused) router.navigate(tab.href);
              }}
              style={({ pressed }) => [
                styles.item,
                focused && styles.itemActive,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons
                name={focused ? tab.focused : tab.idle}
                size={20}
                color={focused ? colors.navy : colors.muted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      tabBar={(props) => <DockTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Enter' }} />
      <Tabs.Screen name="update" options={{ title: 'Update' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dock: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },
  pill: {
    flexDirection: 'row',
    backgroundColor: '#eef2f7',
    borderRadius: 999,
    padding: 5,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 999,
  },
  itemActive: {
    backgroundColor: '#ffffff',
    shadowColor: colors.navy,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.navy,
  },
});