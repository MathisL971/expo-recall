import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="questions"
        options={{
          title: "Questions",
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}
