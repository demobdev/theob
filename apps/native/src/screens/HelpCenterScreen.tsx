import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpCenterScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I earn Box Score points?",
      answer: "You earn points on every dollar spent at THE OWNER'S BOX! Just scan your app at checkout or upload your receipt manually in the 'Earn' tab."
    },
    {
      question: "Can I use rewards for delivery?",
      answer: "Yes! Most rewards can be applied to delivery orders placed directly through our app. Simply select your available reward in the cart during checkout."
    },
    {
      question: "How do I redeem points for merchandise?",
      answer: "Higher-tier rewards like THE OWNER'S BOX Yeti or Apparel can be redeemed in-store. Show your redemption code to your server or bartender to claim."
    },
    {
      question: "My points haven't updated yet.",
      answer: "Points usually appear instantly but can take up to 24 hours to reflect in your ledger. If they haven't appeared after a day, please contact us with your receipt info."
    },
    {
      question: "How do multipliers work?",
      answer: "Multipliers (like 2x points on game days) are applied automatically to qualifying items or during specific event windows. Check the 'Multiplier' banner on the home screen for active promos."
    }
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>HELP CENTER</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.introText}>FREQUENTLY ASKED QUESTIONS</Text>
        
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqWrapper}>
            <TouchableOpacity 
              style={styles.faqHeader} 
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons 
                name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View style={styles.faqBody}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactSub}>Our hospitality team is available daily from 11am to 10pm.</Text>
          <TouchableOpacity style={styles.contactBtn} onPress={() => {}}>
            <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 8,
  },
  headerIcon: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#FFF",
    letterSpacing: 2,
  },
  logoText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 2,
  },
  content: {
    paddingtop: 20,
  },
  introText: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#666",
    paddingHorizontal: 25,
    marginVertical: 20,
    letterSpacing: 1,
  },
  faqWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  faqQuestion: {
    flex: 1,
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#FFF",
    paddingRight: 20,
  },
  faqBody: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  faqAnswer: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    lineHeight: 20,
  },
  contactCard: {
    margin: 25,
    padding: 25,
    backgroundColor: "#161616",
    borderRadius: 15,
    alignItems: "center",
  },
  contactTitle: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MBold",
    marginBottom: 8,
  },
  contactSub: {
    color: "#888",
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    textAlign: "center",
    marginBottom: 20,
  },
  contactBtn: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  contactBtnText: {
    color: "#000",
    fontSize: RFValue(14),
    fontFamily: "MBold",
  }
});

export default HelpCenterScreen;
