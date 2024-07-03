import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Input, Spinner } from "tamagui";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        setError("Invalid email or password");
        console.error(JSON.stringify(signInAttempt, null, 2));

        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (err: any) {
      setError(err.errors[0].message);
      console.error(JSON.stringify(err, null, 2));
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, email, password]);

  const buttonDisabled = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      <Input
        width={"100%"}
        autoCapitalize="none"
        value={email}
        placeholder="Email Address"
        onChangeText={(text) => {
          setEmail(text);
        }}
        autoFocus={true}
      />
      <Input
        width={"100%"}
        value={password}
        placeholder="Password"
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry={true}
      />
      {error && (
        <Text
          style={{
            color: "red",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      )}
      <Button
        theme={buttonDisabled || loading ? "dark" : "green"}
        disabled={buttonDisabled}
        onPress={onSignInPress}
      >
        {loading && <Spinner size="small" color="$green10" />}
        Continue
      </Button>
    </View>
  );
}
