import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { selectAllTests } from '../../redux/slices/brainTestSlice';
import Header from '../../components/Header';
import BrainTestCard from '../../components/BrainTestCard';

const BrainTestScreen = () => {
  const rawTests = useSelector(selectAllTests) || []; // Fetch raw test data from Redux
  const navigation = useNavigation();

  // Map `name` to `type`
  const tests = rawTests.map((test) => ({
    ...test,
    type: test.name, // Use `name` as `type`
  }));

  const handleTestPress = (test) => {
    if (!test || !test.type) {
      console.warn('Unknown test type or invalid test object:', test);
      return;
    }

    // Navigate to the appropriate screen based on the test type
    switch (test.type) {
      case 'Parkinson':
        navigation.navigate('ParkinsonTestScreen', { testId: test.id });
        break;
      case 'Epilepsy':
        navigation.navigate('EpilepsyTestScreen', { testId: test.id });
        break;
      case 'Alzheimer':
        navigation.navigate('AlzheimerTestScreen', { testId: test.id });
        break;
      default:
        console.warn('Unknown test type:', test.type);
    }
  };

  console.log('Tests data:', tests); // Debug log

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Brain Test</Text>
        {tests.length === 0 ? (
          <Text style={styles.emptyMessage}>No tests available</Text>
        ) : (
          <View style={styles.cardContainer}>
            <FlatList
              data={tests}
              numColumns={2}
              renderItem={({ item }) => (
                <BrainTestCard test={item} onPress={() => handleTestPress(item)} />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B50D6',
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 8,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BrainTestScreen;
