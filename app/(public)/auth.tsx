import React, { useState } from "react";
import { View } from "react-native";
import { H1, H6, Button } from "tamagui";
import AuthSheet from "./_components/auth-sheet";

export default function Auth() {
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

      {open && <AuthSheet open={open} setOpen={setOpen} />}
    </View>
  );
}
