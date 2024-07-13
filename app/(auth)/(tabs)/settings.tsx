import { Switch, Text, View } from "react-native";
import { Button, H2, Separator, Spinner } from "tamagui";
import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useAuth } from "@clerk/clerk-expo";

export default function Settings() {
  const { colorScheme, toggleColorScheme } = useContext(ThemeContext);
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          paddingHorizontal: 30,
          paddingBottom: 30,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flexGrow: 1,
          height: "100%",
        }}
      >
        <H2>Settings</H2>
        <Separator />

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "gray",
              }}
            >
              Light/Dark Mode
            </Text>
            <Switch
              value={colorScheme === "dark"}
              onValueChange={() => {
                toggleColorScheme();
              }}
            />
          </View>
        </View>

        <Button
          onPress={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              signOut();
            }, 1500);
          }}
          theme={loading ? "dark" : "red"}
          disabled={loading}
        >
          {loading && <Spinner size="small" color="$red10" />}
          {loading ? "Signing out..." : "Sign Out"}
        </Button>
      </View>
    </View>
  );
}
