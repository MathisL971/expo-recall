import React, { useContext, useState } from "react";
import { View } from "react-native";
import { H1, H6, Button, Tabs, SizableText } from "tamagui";
import { Switch } from "react-native";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Sheet } from "../_components/sheet";
import SignInForm from "./_components/signin-form";
import SignUpForm from "./_components/signup-form";

export default function Auth() {
  const { colorScheme, toggleColorScheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        gap: 15,
        paddingVertical: 30,
        paddingHorizontal: 25,
      }}
    >
      <H1
        style={{
          marginBottom: 10,
          fontFamily: "Inter-Black",
        }}
      >
        Get Started!
      </H1>
      <H6
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Sign in or sign up to start using the app.
      </H6>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          theme={"green"}
          onPress={() => {
            setOpen((prev) => !prev);
          }}
        >
          Continue with Email
        </Button>
      </View>

      <Switch
        value={colorScheme === "dark"}
        onValueChange={() => {
          toggleColorScheme();
        }}
      />
      {open && (
        <Sheet onClose={() => setOpen(false)}>
          <Tabs
            defaultValue={"tab1"}
            orientation="horizontal"
            flexDirection="column"
            overflow="hidden"
          >
            <Tabs.List
              disablePassBorderRadius="bottom"
              aria-label="Authentication Tabs"
              style={{
                marginBottom: 20,
              }}
            >
              <Tabs.Tab flex={1} value="tab1">
                <SizableText fontFamily="$body">Sign In</SizableText>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="tab2">
                <SizableText fontFamily="$body">Sign Up</SizableText>
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Content
              value="tab1"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <SignInForm />
            </Tabs.Content>

            <Tabs.Content value="tab2">
              <SignUpForm />
            </Tabs.Content>
          </Tabs>
        </Sheet>
      )}
    </View>
  );
}
