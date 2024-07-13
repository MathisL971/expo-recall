import { Sheet as TamaguiSheet } from "@tamagui/sheet";
import { useContext, useState } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

type SheetProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Sheet = (props: SheetProps) => {
  const { colorScheme } = useContext(ThemeContext);

  const [position, setPosition] = useState(0);

  return (
    <TamaguiSheet
      forceRemoveScrollEnabled={true}
      modal={true}
      open={true}
      onOpenChange={props.onClose}
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
      <TamaguiSheet.Frame
        padding="$5"
        gap={15}
        backgroundColor={colorScheme === "dark" ? "#1e1e1e" : "#eaeaea"}
      >
        {props.children}
      </TamaguiSheet.Frame>
    </TamaguiSheet>
  );
};
