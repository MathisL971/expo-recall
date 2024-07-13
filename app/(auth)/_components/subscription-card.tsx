import { View, Text, Switch } from "react-native";
import React, { useEffect } from "react";
import TrashIcon from "../../../assets/svgs/trash";

import { Card, H4, Slider, Spinner } from "tamagui";
import { useState } from "react";
import {
  deleteResourceSubscription,
  deleteResourceSubscriptionById,
  updateResourceSubscription,
} from "../../../firebaseConfig";
import { ResourceSubscription } from "@/types/ResourceSubscription";

type SubscriptionCardProps = {
  sub: ResourceSubscription;
  setSubscriptions: React.Dispatch<
    React.SetStateAction<ResourceSubscription[]>
  >;
};

const SubscriptionCard = (props: SubscriptionCardProps) => {
  const { sub, setSubscriptions } = props;

  const [pageEnd, setPageEnd] = useState(sub.maxPage);

  const [loading, setLoading] = useState(false);

  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (updateCount === 0) return;

    updateResourceSubscription(sub.id, {
      maxPage: pageEnd,
    }).catch((error) => {
      console.error(error);
    });
  }, [updateCount]);

  return (
    <Card
      key={sub.id}
      elevate
      size="$4"
      bordered
      width={"fit-content"}
      height={"fit-content"}
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
    >
      <Card.Header
        padded
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: "70%",
          }}
        >
          <H4 fontSize={20}>{sub.resource.title}</H4>
          <Text
            style={{
              fontSize: 17,
              color: "gray",
              marginBottom: 5,
            }}
          >
            {sub.resource.author}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <Switch
            value={sub.shouldQuiz}
            onValueChange={async () => {
              try {
                updateResourceSubscription(sub.id, {
                  shouldQuiz: !sub.shouldQuiz,
                });
                setSubscriptions((subs) =>
                  subs.map((s) =>
                    s.id === sub.id
                      ? { ...sub, shouldQuiz: !sub.shouldQuiz }
                      : s
                  )
                );
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onTouchStart={async () => {
              if (loading) return;

              setLoading(true);
              try {
                await deleteResourceSubscriptionById(sub.id);
                setSubscriptions((subs) => subs.filter((s) => s.id !== sub.id));
                setLoading(false);
              } catch (error) {
                console.error(error);
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <Spinner size="small" color="$red10" style={{ marginTop: 3 }} />
            ) : (
              <TrashIcon />
            )}
          </View>
        </View>
      </Card.Header>
      <Card.Footer
        padded
        paddingTop={0}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Slider
            max={sub.resource.numPages}
            min={0}
            step={1}
            width={"75%"}
            dir="ltr"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              flexGrow: 1,
            }}
            value={[0, pageEnd]}
            onValueChange={(value) => {
              setPageEnd(value[1]);
            }}
            onSlideEnd={() => {
              setUpdateCount(updateCount + 1);
            }}
          >
            <Slider.Track
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "gray",
              }}
            >
              <Slider.TrackActive
                style={{
                  backgroundColor: "green",
                }}
              />
            </Slider.Track>
            <Slider.Thumb size="$2" index={1} circular />
          </Slider>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              paddingLeft: 10,
              width: "13%",
            }}
          >
            {pageEnd}
          </Text>
        </View>
      </Card.Footer>
    </Card>
  );
};

export default SubscriptionCard;
