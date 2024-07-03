import { getSavedResources, updateResource } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";

export default function Library() {
  const [savedResources, setSavedResources] = useState([]);

  useEffect(() => {
    getSavedResources().then((data) => {
      setSavedResources(data);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        Your Library
      </Text>
      <View>
        {savedResources.map((resource, i) => (
          <View
            key={resource.id}
            style={{
              padding: 10,
              marginVertical: 5,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "black",
            }}
          >
            <Text>{resource.title}</Text>
            <Text>{resource.author}</Text>
            {/* Toggle to get quizzed */}
            <Switch
              value={resource.shouldQuiz}
              onValueChange={(value) => {
                // Update the resource in Firebase
                updateResource(resource.id, {
                  ...resource,
                  shouldQuiz: value,
                }).then(() => {
                  // Update the local state
                  setSavedResources((prev) =>
                    prev.map((r) =>
                      r.id === resource.id ? { ...r, shouldQuiz: value } : r
                    )
                  );
                });
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
