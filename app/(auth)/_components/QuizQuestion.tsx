import { Question } from "@/types/Question";
import React, { useState } from "react";
import {
  Button,
  H4,
  Label,
  RadioGroup,
  Spinner,
  Text,
  View,
  YStack,
  XStack,
  Paragraph,
} from "tamagui";

type Props = {
  question: Question;
  onSubmit: (selection: string | null) => Promise<void>;
};

const QuizQuestion = (props: Props) => {
  const { question: openedQuestion, onSubmit } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<string | null>(null);

  return (
    <View
      style={{
        gap: "5px",
      }}
    >
      <H4>{openedQuestion.prompt}</H4>
      <Paragraph
        style={{
          fontSize: "14px",
          color: "gray",
        }}
      >
        Please select one of the following three options.
      </Paragraph>
      <RadioGroup
        style={{
          marginBottom: 5,
        }}
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
                  gap: "15px",
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
            setLoading(true);
            await onSubmit(selection);
            setLoading(false);
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
            You answered incorrectly... 😢 We will quiz you again to make sure
            you understand the material.
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuizQuestion;
