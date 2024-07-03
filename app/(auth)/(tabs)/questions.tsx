import { getQuestions } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Questions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuestions().then((data) => {
      setQuestions(data);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Questions</Text>

      <View>
        {questions.map((question) => (
          <View
            key={question.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              borderWidth: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {"Resource Title - Resource Author"}
              </Text>
              <Text style={{ color: "gray" }}>{"10 mins ago"}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  overflow: "hidden",
                  flexGrow: 1,
                }}
              >
                {question.prompt}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: question.selection
                    ? question.selection === question.answer
                      ? "green"
                      : "red"
                    : "gray",
                  color: question.selection
                    ? question.selection === question.answer
                      ? "green"
                      : "red"
                    : "gray",
                  backgroundColor: question.selection
                    ? question.selection === question.answer
                      ? "lightgreen"
                      : "lightcoral"
                    : "lightgray",
                  padding: 2,
                }}
              >
                {question.selection
                  ? question.selection === question.answer
                    ? "Correct"
                    : "Wrong"
                  : "Unanswered"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
