import React from "react";
import {
  Button,
  Dialog,
  Sheet,
  XStack,
  Unspaced,
  Adapt,
  Spinner,
} from "tamagui";
import QuizQuestion from "./QuizQuestion";
import { Question } from "@/types/Question";
import { updateQuestion } from "@/firebaseConfig";
import axios, { AxiosResponse } from "axios";
import Icon from "react-native-vector-icons/Ionicons";

type Props = {
  quizData: any;
  setQuizData: React.Dispatch<React.SetStateAction<any>>;
};

const QuizModal = (props: Props) => {
  const { quizData, setQuizData } = props;
  const { subscription, initialQuestion } = quizData;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = React.useState<Question | null>(
    initialQuestion
  );

  if (!currentQuestion) {
    return null;
  }

  return (
    <Dialog modal open={true}>
      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
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
          animation="slow"
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
          style={{
            width: "85%",
            height: "fit-content",
          }}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$2"
        >
          <Dialog.Title
            style={{
              marginBottom: 0,
            }}
          >
            Let's get you quizzed!
          </Dialog.Title>
          <Dialog.Description
            style={{
              marginBottom: 10,
              color: "gray",
            }}
          >
            Try to answer the following questions to the best of your ability.
          </Dialog.Description>

          <QuizQuestion
            question={currentQuestion}
            onSubmit={async (selection) => {
              try {
                await updateQuestion(currentQuestion.id, {
                  selection,
                });

                const updatedQuestion = {
                  ...currentQuestion,
                  selection,
                };

                setCurrentQuestion(updatedQuestion);
              } catch (error) {
                console.error(error);
              }
            }}
          />

          <XStack alignSelf="flex-end" gap="$4" marginTop={5}>
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                theme={
                  currentQuestion.selection === null || loading
                    ? "light"
                    : "active"
                }
                disabled={currentQuestion.selection === null || loading}
                onPress={async () => {
                  try {
                    setLoading(true);

                    const response: AxiosResponse = await axios.post(
                      `https://348f-24-48-7-74.ngrok-free.app/create-question`,
                      {
                        subscriptionId: subscription.id,
                      }
                    );

                    setLoading(false);
                    setCurrentQuestion(response.data);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{
                  width: "100%",
                }}
              >
                {loading ? "Loading..." : "Next Question"}
                {loading && <Spinner size="small" color="$green10" />}
              </Button>
            </Dialog.Close>
          </XStack>

          <Unspaced>
            <Dialog.Close
              asChild
              onPress={() => {
                setQuizData(null);
              }}
            >
              <Button
                position="absolute"
                top="$4"
                right="$4"
                size="$3"
                circular
              >
                <Icon name="close" size={30} />
              </Button>
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default QuizModal;
