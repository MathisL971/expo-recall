import { Pressable, Text, TextInput, View } from "react-native";
import { getResources, updateResource } from "../../firebaseConfig";
import { useEffect, useState } from "react";

export default function Index() {
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState([]);

  useEffect(() => {
    getResources().then((data) => {
      setResources(data);
    });
  }, []);

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Welcome to the app!
      </Text>

      <Text>
        Add a new resource to your collection and start getting quizzed on it!
      </Text>

      <TextInput
        placeholder="Resource Name"
        value={search}
        style={{
          marginVertical: 10,
          padding: 5,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: "black",
          width: "100%",
        }}
        onChangeText={(text) => setSearch(text)}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {filteredResources.map((resource) => (
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
            {/* Add button */}
            <Pressable
              style={{
                backgroundColor: resource.saved ? "red" : "blue",
                padding: 5,
                borderRadius: 5,
                marginTop: 5,
                margin: "auto",
              }}
              onPress={() => {
                // Add the resource to the user's library
                // or remove it if it's already there
                updateResource(resource.id, {
                  ...resource,
                  saved: !resource.saved,
                }).then(() => {
                  getResources().then((data) => {
                    setResources(data);
                  });
                });
              }}
            >
              <Text style={{ color: "white" }}>
                {resource.saved ? "Remove from Library" : "Add to Library"}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
