import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import type { LegalDocument } from "@packages/legal";

type Props = {
  document: LegalDocument;
};

export default function LegalDocumentView({ document }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {document.intro ? (
        <Text style={styles.introText}>{document.intro}</Text>
      ) : null}
      {document.sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.paragraphs.map((paragraph) => (
            <Text key={paragraph.slice(0, 48)} style={styles.bodyText}>
              {paragraph}
            </Text>
          ))}
        </View>
      ))}
      <Text style={styles.footerText}>
        Last updated: {document.lastUpdated}
      </Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 25,
  },
  introText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#AAA",
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#DDD",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    lineHeight: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: RFValue(10),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
});
