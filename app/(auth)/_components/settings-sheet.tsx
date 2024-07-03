import { Sheet as TamaguiSheet } from "@tamagui/sheet";
import { useState } from "react";
import { Button } from "tamagui";
import { useAuth } from "@clerk/clerk-react";

type SheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const SettingsSheet = (props: SheetProps) => {
  const { open, setOpen } = props;
  const { signOut } = useAuth();

  const [position, setPosition] = useState(0);

  const onSignOutPress = () => {
    signOut();
    setOpen(false);
  };

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
        <Button onPress={onSignOutPress} theme="red">
          Sign Out
        </Button>
      </TamaguiSheet.Frame>
    </TamaguiSheet>
  );
};
