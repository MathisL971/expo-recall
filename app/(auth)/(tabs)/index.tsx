import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  createResourceSubscription,
  deleteResourceSubscription,
  getResources,
  getResourceSubscriptions,
} from "../../../firebaseConfig";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  Adapt,
  Button,
  Card,
  Dialog,
  H1,
  H3,
  H5,
  Image,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Tabs,
  Text,
  Unspaced,
  XStack,
} from "tamagui";
import { ResourceWithIsSaved } from "@/types/Resource";
import { CameraView, useCameraPermissions } from "expo-camera";
import CycleArrowsIcon from "../../../assets/svgs/cycle-arrows";
import CameraIcon from "../../../assets/svgs/camera";
import * as FileSystem from "expo-file-system";

import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";

export default function Index() {
  const { user } = useUser();

  const [search, setSearch] = useState<string>("");
  const [resources, setResources] = useState<ResourceWithIsSaved[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [resourceUpdating, setResourceUpdating] =
    useState<ResourceWithIsSaved | null>(null);

  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [text, setText] = useState("");

  let camera = null;

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const createPdf = async (imageUri) => {
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const docsDir = await FileSystem.documentDirectory;
    const pdfPath = `${docsDir}photo.pdf`;

    const pdfDoc = PDFDocument.create(pdfPath);
    const page = PDFPage.create()
      .setMediaBox(200, 200)
      .drawImage(base64Image, "jpg", { x: 0, y: 0, width: 200, height: 200 });

    await pdfDoc.addPages(page).write();

    return pdfPath;
  };

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

          <Tabs
            defaultValue="tab1"
            orientation="horizontal"
            flexDirection="column"
            width={"100%"}
            borderRadius="$4"
            borderWidth="$0.25"
            overflow="hidden"
            borderColor="$borderColor"
          >
            <Tabs.List
              disablePassBorderRadius="bottom"
              aria-label="Manage your account"
            >
              <Tabs.Tab flex={1} value="tab1">
                <Text fontFamily="$body">Library</Text>
              </Tabs.Tab>
              {/* <Tabs.Tab flex={1} value="tab2">
                <Text fontFamily="$body">Picture</Text>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="tab3">
                <Text fontFamily="$body">Upload</Text>
              </Tabs.Tab> */}
            </Tabs.List>
            <Separator />
            <Tabs.Content
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 10,
              }}
              value="tab1"
            >
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
                      marginVertical: 10,
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
                                    color={
                                      resource.isSaved ? "$red10" : "$green10"
                                    }
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
            </Tabs.Content>

            {/* <Tabs.Content
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 10,
              }}
              value="tab2"
            >
              <Dialog modal>
                <Dialog.Trigger asChild>
                  <Button>Open Camera</Button>
                </Dialog.Trigger>

                <Adapt when="sm" platform="touch">
                  <Sheet
                    animation="medium"
                    zIndex={200000}
                    modal
                    dismissOnSnapToBottom
                  >
                    <Sheet.Frame padding="$4" gap="$4">
                      <Adapt.Contents />
                    </Sheet.Frame>
                    <Sheet.Overlay
                      animation="lazy"
                      enterStyle={{ opacity: 0 }}
                      exitStyle={{ opacity: 0 }}
                    />
                  </Sheet>
                </Adapt>

                <Dialog.Portal>
                  <Dialog.Overlay
                    key="overlay"
                    animation="medium"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />

                  <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={["transform", "opacity"]}
                    animation={[
                      "quicker",
                      {
                        opacity: {
                          overshootClamping: true,
                        },
                      },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                  >
                    <View style={styles.container}>
                      {!photo ? (
                        <CameraView
                          style={styles.camera}
                          facing={facing}
                          ref={(ref) => (camera = ref)}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              backgroundColor: "transparent",
                              gap: 10,
                              justifyContent: "center",
                              alignItems: "flex-end",
                              marginBottom: 20,
                            }}
                          >
                            <Button
                              onPress={() => {
                                toggleCameraFacing();
                              }}
                            >
                              <CycleArrowsIcon />
                            </Button>
                            <Button
                              onPress={() => {
                                if (camera) {
                                  camera.takePictureAsync({
                                    onPictureSaved: async (photo) => {
                                      const pdfPath = await createPdf(
                                        photo.uri
                                      );

                                      setText(res.text);
                                      setPhoto(photo);
                                    },
                                  });
                                }
                              }}
                            >
                              <CameraIcon />
                            </Button>
                          </View>
                        </CameraView>
                      ) : (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "black",
                              opacity: 0.7,
                            }}
                          >
                            <Image
                              source={{ uri: photo.uri }}
                              style={{
                                width: "100%",
                                height: 500,
                              }}
                            ></Image>
                          </View>

                          <Button
                            onPress={() => {
                              setPhoto(null);
                            }}
                          >
                            Retake
                          </Button>
                        </View>
                      )}
                    </View>

                    <XStack marginBottom={10}>
                      <Dialog.Close displayWhenAdapted asChild>
                        <Button
                          style={{
                            width: "100%",
                          }}
                          theme={"red"}
                        >
                          Close
                        </Button>
                      </Dialog.Close>
                    </XStack>

                    <Unspaced>
                      <Dialog.Close asChild>
                        <Button
                          position="absolute"
                          top="$3"
                          right="$3"
                          size="$2"
                          circular
                        />
                      </Dialog.Close>
                    </Unspaced>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            </Tabs.Content> */}

            {/* <Tabs.Content
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 10,
              }}
              value="tab3"
            >
              <H5>Notifications</H5>
            </Tabs.Content> */}
          </Tabs>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 30,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
