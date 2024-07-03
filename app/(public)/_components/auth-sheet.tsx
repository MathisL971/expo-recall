import { Sheet as TamaguiSheet } from "@tamagui/sheet";
import { useState } from "react";
import { SizableText, Tabs } from "tamagui";
import SignUpForm from "./signup-form";
import SignInForm from "./signin-form";

type SheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const AuthSheet = (props: SheetProps) => {
  const { open, setOpen } = props;

  const [position, setPosition] = useState(0);

  return (
    <TamaguiSheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
      snapPointsMode={"percent"}
      snapPoints={[85, 50]}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      animation="medium"
    >
      <TamaguiSheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <TamaguiSheet.Handle />
      <TamaguiSheet.Frame padding="$5" gap={15} backgroundColor={"#1e1e1e"}>
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
      </TamaguiSheet.Frame>
    </TamaguiSheet>
  );
};

export default AuthSheet;
