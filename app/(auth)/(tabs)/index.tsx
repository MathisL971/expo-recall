import { View } from "react-native";
import { getResources, updateResource } from "../../../firebaseConfig";
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  H1,
  H3,
  H6,
  Image,
  Input,
  Paragraph,
  ScrollView,
  XStack,
} from "tamagui";

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        gap: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
      }}
    >
      <ScrollView>
        <View
          style={{
            flex: 1,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <View>
            <H1
              style={{
                marginBottom: 20,
              }}
            >
              Welcome to the app!
            </H1>

            <H6>
              Add a new resource to your collection and start getting quizzed on
              it!
            </H6>
          </View>

          <Input
            placeholder="Resource Name"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {filteredResources.map((resource) => (
              <Card
                key={resource.id}
                elevate
                size="$4"
                bordered
                animation="bouncy"
                width={"fit-content"}
                height={"fit-content"}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
              >
                <Card.Header padded>
                  <H3>{resource.title}</H3>
                  <Paragraph theme="alt2">{resource.author}</Paragraph>
                </Card.Header>
                <Card.Footer padded>
                  <XStack flex={1} />
                  <Button
                    borderRadius="$10"
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
                    {resource.saved ? "Remove from Library" : "Add to Library"}
                  </Button>
                </Card.Footer>
                <Card.Background>
                  <Image
                    resizeMode="contain"
                    alignSelf="center"
                    source={{
                      width: 350,
                      height: 250,
                      uri: "https://miro.medium.com/v2/resize:fit:1400/1*uNCVd_VqFOcdxhsL71cT5Q.jpeg",
                    }}
                  />
                </Card.Background>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
