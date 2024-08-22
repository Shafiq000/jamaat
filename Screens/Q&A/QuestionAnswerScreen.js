import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import HeaderBack from '../../Components/HeaderBack';
import { useAuthContext } from '../../Navigations/AuthContext';
import { useTranslation } from "react-i18next";

const QuestionAnswerScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const { themeMode } = useAuthContext();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container,themeMode === 'dark' && { backgroundColor: '#1C1C22' }]}>
      <HeaderBack title={t('question_answer')} navigation={navigation} />
      <ScrollView contentContainerStyle={[styles.contentContainerStyle,themeMode === 'dark' && { backgroundColor: '#1C1C22' }]}>
        <View style={styles.questionContainer}>
          <Text style={[styles.questionWord,themeMode === 'dark' && { color: '#fff' }]}>{t('question')}</Text>
          <Text style={[styles.questionTitle,themeMode === 'dark' && { color: '#fff' }]}>{item.question}</Text>
          <Text style={[styles.questionTitle,themeMode === 'dark' && { color: '#fff' }]}>{item.answer}</Text>
        </View>
       <View style={styles.questionContainer}>
         <Text style={[styles.questionWord,themeMode === 'dark' && { color: '#fff' }]}>{t('answer')}</Text>
         <Text style={[styles.answer,themeMode === 'dark' && { color: '#fff' }]}>{item.explanation}</Text>
       </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionAnswerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainerStyle: {
    backgroundColor: '#fff',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  answer: {
    fontSize: 16,
    lineHeight: 24,
    textAlign:'auto'
  },
  questionContainer: {
    padding: 15,
    flexDirection: 'column',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  questionWord: {
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
  }
});
