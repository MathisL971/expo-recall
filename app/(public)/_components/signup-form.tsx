import React, { useState } from "react";
import { View } from "react-native";
import { Button, Input, Spinner } from "tamagui";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const continueDisabled =
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8;

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
      }}
    >
      {!pendingVerification ? (
        <>
          <Input
            autoCapitalize="none"
            value={email}
            placeholder="Email Address"
            onChangeText={(email) => setEmail(email)}
            autoFocus={true}
          />
          <Input
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button
            theme={continueDisabled || loading ? "dark" : "green"}
            disabled={continueDisabled || loading}
            onPress={onSignUpPress}
          >
            {loading && <Spinner size="small" color="$green10" />}
            Continue
          </Button>
        </>
      ) : (
        <>
          <Input
            value={code}
            placeholder="Code"
            onChangeText={(code) => setCode(code)}
          />
          <Button
            theme={loading ? "dark" : "green"}
            disabled={loading}
            onPress={onPressVerify}
          >
            {loading && <Spinner size="small" color="$green10" />}
            Verify Email
          </Button>
        </>
      )}
    </View>
  );
}
