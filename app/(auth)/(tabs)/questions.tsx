import { getQuestions, updateQuestion } from "@/firebaseConfig";
import { Question } from "@/types/Question";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Text,
  Button,
  Card,
  H2,
  H4,
  Label,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Spinner,
  XStack,
  YStack,
} from "tamagui";
import { useUser } from "@clerk/clerk-expo";
import { Sheet } from "@/app/_components/sheet";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";

export default function Questions() {
  const { colorScheme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [openedQuestion, setOpenedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    getQuestions(user.id)
      .then((questions) => {
        setQuestions(questions);
        setFetching(false);
      })
      .catch((e) => console.error(e));
  }, [user]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <ScrollView>
        <View
          style={{
            flex: 1,
            paddingVertical: 50,
            paddingHorizontal: 30,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <H2>Questions</H2>
          <Separator />
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
                  Fetching questions...
                </Text>
                <Spinner size="small" color="green" />
              </View>
            ) : questions.length > 0 ? (
              questions
                .sort((a, b) => {
                  return a.dateCreated > b.dateCreated ? -1 : 1;
                })
                .map((question) => {
                  return (
                    <Card
                      key={question.id}
                      elevate
                      size="$4"
                      bordered
                      animation="bouncy"
                      width={"100%"}
                      height={"fit-content"}
                      scale={0.9}
                      hoverStyle={{ scale: 0.925 }}
                      pressStyle={{ scale: 0.875 }}
                      onPress={() => {
                        setOpenedQuestion(question);
                      }}
                    >
                      <Card.Header padded paddingBottom={10} gap={5}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <H4
                            style={{
                              width: "68%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              lineHeight: "25",
                            }}
                            fontSize={20}
                          >
                            {question.resource.title}
                          </H4>
                          <View
                            style={{
                              width: "32%",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              marginTop: 3,
                            }}
                          >
                            {question.selection ? (
                              question.selection === question.answer ? (
                                <View
                                  style={{
                                    paddingVertical: 4,
                                    borderRadius: 5,
                                    backgroundColor: "green",
                                    marginBottom: "auto",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      paddingHorizontal: 6,
                                      fontWeight: "bold",
                                      fontSize: 12,
                                    }}
                                  >
                                    Correct
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    paddingVertical: 4,
                                    borderRadius: 5,
                                    backgroundColor: "red",
                                    marginBottom: "auto",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "white",
                                      paddingHorizontal: 6,
                                      fontWeight: "bold",
                                      fontSize: 12,
                                    }}
                                  >
                                    Incorrect
                                  </Text>
                                </View>
                              )
                            ) : (
                              <View
                                style={{
                                  paddingVertical: 4,
                                  borderRadius: 5,
                                  backgroundColor: "gray",
                                  marginBottom: "auto",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    paddingHorizontal: 6,
                                    fontWeight: "bold",
                                    fontSize: 12,
                                  }}
                                >
                                  Unanswered
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <Text
                          style={{
                            fontSize: 18,
                            color: "gray",
                            marginBottom: 5,
                          }}
                        >
                          {question.resource.author}
                        </Text>
                      </Card.Header>
                      <Card.Footer padded paddingTop={0}>
                        <Text
                          color={colorScheme === "dark" ? "white" : "black"}
                          style={{
                            fontSize: 15,
                          }}
                        >
                          {question.prompt}
                        </Text>
                      </Card.Footer>
                    </Card>
                  );
                })
            ) : (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  You have no questions yet... 🥺 Make sure quizzing is enabled
                  on the books you've subscribed to!
                </Text>
                <Button
                  theme={"green"}
                  onPress={() => {
                    router.push("/library");
                  }}
                >
                  <Text>Go to Library</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {openedQuestion && (
        <Sheet onClose={() => setOpenedQuestion(null)}>
          <H4>{openedQuestion.prompt}</H4>
          <Paragraph
            style={{
              fontSize: "16px",
              color: "gray",
            }}
          >
            Please select one of the following three options.
          </Paragraph>
          <RadioGroup
            defaultValue={
              openedQuestion.selection ? openedQuestion.selection : undefined
            }
          >
            <YStack
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {openedQuestion.choices.map((choice) => {
                return (
                  <XStack
                    key={choice}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: 10,
                      borderRadius: "10px",
                      backgroundColor: openedQuestion.selection
                        ? openedQuestion.selection === choice
                          ? openedQuestion.answer === choice
                            ? "green"
                            : "red"
                          : choice === openedQuestion.answer
                          ? "green"
                          : ""
                        : "",
                    }}
                  >
                    <RadioGroup.Item
                      disabled={openedQuestion.selection !== null}
                      value={choice}
                      id={`radiogroup-${choice}`}
                      size={"$6"}
                      onPress={() => {
                        setSelection(choice);
                      }}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <Label
                      style={{
                        margin: 0,
                        padding: 0,
                        lineHeight: "22",
                        width: "85%",
                      }}
                      htmlFor={`radiogroup-${choice}`}
                      size={"$5"}
                    >
                      {choice}
                    </Label>
                  </XStack>
                );
              })}
            </YStack>
          </RadioGroup>
          {!openedQuestion?.selection ? (
            <Button
              theme={
                loading || openedQuestion.selection !== null ? "dark" : "green"
              }
              disabled={loading || openedQuestion.selection !== null}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
              }}
              onPress={async () => {
                try {
                  setLoading(true);
                  await updateQuestion(openedQuestion.id, {
                    selection,
                  });

                  const updatedQuestion = {
                    ...openedQuestion,
                    selection,
                  };
                  setOpenedQuestion(updatedQuestion);
                  setQuestions((questions) =>
                    questions.map((q) =>
                      q.id === openedQuestion.id ? updatedQuestion : q
                    )
                  );
                  setLoading(false);
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {loading && <Spinner size="small" color="$green10" />}
                <Text>{loading ? "Submitting..." : "Submit"}</Text>
              </View>
            </Button>
          ) : openedQuestion.selection === openedQuestion.answer ? (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                backgroundColor: "green",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Congrats! You answered correctly! 🎉
              </Text>
            </View>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                backgroundColor: "red",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                You answered incorrectly... 😢 We will quiz you again to make
                sure you understand the material.
              </Text>
            </View>
          )}
        </Sheet>
      )}
    </View>
  );
}
