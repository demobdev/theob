import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FightNightHeroCard, { FightNightGame } from "./FightNightHeroCard";
import RacingEventCard, { RacingEventGame } from "./RacingEventCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.88;
const CARD_GAP = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export type CarouselSlot =
  | { kind: "team"; id: string; game: any }
  | { kind: "ufc"; id: string; event: FightNightGame }
  | { kind: "racing"; id: string; event: RacingEventGame };

type Props = {
  slots: CarouselSlot[];
  renderTeamCard: (game: any) => React.ReactElement;
  onUfcPress: (event: FightNightGame) => void;
  onRacingPress: (event: RacingEventGame) => void;
};

export default function DynamicGamesCarousel({
  slots,
  renderTeamCard,
  onUfcPress,
  onRacingPress,
}: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<CarouselSlot>>(null);

  if (slots.length === 0) return null;

  const renderItem = ({ item }: { item: CarouselSlot }) => {
    const wrap = (node: React.ReactElement) => (
      <View style={styles.slide}>{node}</View>
    );

    if (item.kind === "ufc") {
      return wrap(
        <FightNightHeroCard
          event={item.event}
          onPress={() => onUfcPress(item.event)}
          layout="carousel"
        />,
      );
    }
    if (item.kind === "racing") {
      return wrap(
        <RacingEventCard
          event={item.event}
          onPress={() => onRacingPress(item.event)}
          layout="carousel"
        />,
      );
    }
    return wrap(renderTeamCard(item.game));
  };

  return (
    <View style={styles.section}>
      <FlatList
        ref={listRef}
        data={slots}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
          setIndex(idx);
        }}
        getItemLayout={(_, i) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * i,
          index: i,
        })}
      />
      {slots.length > 1 && (
        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.arrow, index === 0 && styles.arrowDisabled]}
            onPress={() => {
              const next = Math.max(0, index - 1);
              setIndex(next);
              listRef.current?.scrollToIndex({ index: next, animated: true });
            }}
            disabled={index === 0}
          >
            <Ionicons name="chevron-back" size={18} color="#FFA500" />
          </TouchableOpacity>
          <View style={styles.dots}>
            {slots.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.arrow,
              index === slots.length - 1 && styles.arrowDisabled,
            ]}
            onPress={() => {
              const next = Math.min(slots.length - 1, index + 1);
              setIndex(next);
              listRef.current?.scrollToIndex({ index: next, animated: true });
            }}
            disabled={index === slots.length - 1}
          >
            <Ionicons name="chevron-forward" size={18} color="#FFA500" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  slide: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 14,
    marginBottom: 10,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "rgba(255,165,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDisabled: {
    opacity: 0.2,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  dotActive: {
    backgroundColor: "#FFA500",
    width: 20,
  },
});
