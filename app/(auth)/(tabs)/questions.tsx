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
  ScrollView,
  Separator,
  Spinner,
} from "tamagui";
import { useUser } from "@clerk/clerk-expo";
import { Sheet } from "@/app/_components/sheet";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import QuizQuestion from "../_components/QuizQuestion";

export default function Questions() {
  const { colorScheme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [openedQuestion, setOpenedQuestion] = useState<Question | null>(null);

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
          <QuizQuestion
            question={openedQuestion}
            onSubmit={async (selection) => {
              try {
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
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </Sheet>
      )}
    </View>
  );
}
