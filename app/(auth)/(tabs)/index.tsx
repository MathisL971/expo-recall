import { View } from "react-native";
import {
  createResourceSubscription,
  deleteResourceSubscription,
  getResources,
  getResourceSubscriptions,
} from "../../../firebaseConfig";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  Button,
  Card,
  H1,
  H3,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Spinner,
  Text,
  XStack,
} from "tamagui";
import { ResourceWithIsSaved } from "@/types/Resource";

export default function Index() {
  const { user } = useUser();

  const [search, setSearch] = useState<string>("");
  const [resources, setResources] = useState<ResourceWithIsSaved[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [resourceUpdating, setResourceUpdating] =
    useState<ResourceWithIsSaved | null>(null);

  useEffect(() => {
    if (!user) return;

    getResources()
      .then((resources) => {
        getResourceSubscriptions(user.id)
          .then((subscriptions) => {
            const updatedResources: ResourceWithIsSaved[] = resources.map(
              (resource) => {
                let isSaved = false;
                subscriptions.forEach((subscription) => {
                  if (subscription.resource.id === resource.id) {
                    isSaved = true;
                  }
                });

                return {
                  ...resource,
                  isSaved,
                };
              }
            );

            setResources(updatedResources);
            setFetching(false);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }, [user]);

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
        flexGrow: 1,
        backgroundColor: "$green2",
      }}
    >
      <ScrollView>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 30,
            paddingVertical: 50,
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <View>
            <H1
              style={{
                marginBottom: 10,
              }}
            >
              Welcome to the app!
            </H1>
            <Text
              style={{
                color: "gray",
                fontSize: 16,
              }}
            >
              Add a new resource to your collection and start getting quizzed on
              it!
            </Text>
          </View>

          <Separator />

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
            {fetching ? (
              <View
                style={{
                  marginTop: 10,
                  justifyContent: "center",
                  gap: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  Fetching books...
                </Text>
                <Spinner size="small" color="green" />
              </View>
            ) : (
              filteredResources.map((resource) => {
                return (
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
                        theme={resource.isSaved ? "red" : "green"}
                        disabled={resourceUpdating?.id === resource.id}
                        backgroundColor={
                          !resource.isSaved
                            ? resourceUpdating?.id === resource.id
                              ? "$green4"
                              : "$green7"
                            : resourceUpdating?.id === resource.id
                            ? "$red4"
                            : "$red7"
                        }
                        onPress={async () => {
                          setResourceUpdating(resource);
                          if (resource.isSaved) {
                            await deleteResourceSubscription(
                              user!.id,
                              resource.id
                            );
                            setResources(
                              resources.map((r) => {
                                return r.id === resource.id
                                  ? { ...r, isSaved: false }
                                  : r;
                              })
                            );
                          } else {
                            await createResourceSubscription(
                              user!.id,
                              resource.id
                            );
                            setResources(
                              resources.map((r) => {
                                return r.id === resource.id
                                  ? { ...r, isSaved: true }
                                  : r;
                              })
                            );
                          }
                          setResourceUpdating(null);
                        }}
                      >
                        {resource.isSaved ? (
                          resourceUpdating?.id === resource.id ? (
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <Spinner
                                size="small"
                                color={resource.isSaved ? "$red10" : "$green10"}
                              />
                              <Text>{"Removing..."}</Text>
                            </View>
                          ) : (
                            "Remove from Library"
                          )
                        ) : resourceUpdating?.id === resource.id ? (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <Spinner size="small" color="$green10" />
                            <Text>{"Adding..."}</Text>
                          </View>
                        ) : (
                          "Add to Library"
                        )}
                      </Button>
                    </Card.Footer>
                  </Card>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
