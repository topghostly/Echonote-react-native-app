import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";

interface modalType {
  setShowModalScreen: any;
}

const ModalScreen: React.FC<modalType> = ({ setShowModalScreen }) => {
  const bottomSheetRef = useRef(null);
  // const snapPoints = useMemo(() => ["35%", "43%", "100%"]);

  //   const renderBackDrop = useCallback((props) => [
  //     <BottomSheetBackdrop
  //       appearsOnIndex={0}
  //       disappearsOnIndex={-1}
  //       {...props}
  //     />,
  //   ]);
  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      // snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => {
        setShowModalScreen(false);
      }}
      //   backdropComponent={renderBackDrop}
    >
      <BottomSheetView
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 8,
          gap: 9,
        }}
      >
        <TouchableOpacity>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Share</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({});
