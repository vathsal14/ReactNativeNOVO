import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,

} from 'react-native';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../redux/slices/authSlice';
import { COLORS, FONTS } from '../../constants/theme';


const { width } = Dimensions.get('window');

const conditions = [
  {
    id: 'alzheimers',
    title: 'ALZHEIMER\'S',
    //image: require('../../Assets/image/alzheimers.jpeg'),
    image: require('../../Assets/image/download.jpeg'),
    description: 'Alzheimer\'s disease is a progressive neurologic disorder that causes the brain to shrink (atrophy) and brain cells to die. It is the most common cause of dementia.',
  },
  {
    id: 'epilepsy',
    title: 'EPILEPSY',
    image: require('../../Assets/image/epilepsy.jpeg'),
    description: 'Epilepsy is a central nervous system (neurological) disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior, sensations, and sometimes loss of awareness.',
  },
  {
    id: 'parkinson',
    title: 'PARKINSON',
    image: require('../../Assets/image/parkinson.jpeg'),
    description: 'Parkinson\'s disease is a progressive disorder that affects the nervous system and the parts of the body controlled by the nerves. Symptoms start gradually, sometimes with a barely noticeable tremor in just one hand.',
  },
  {
    id: 'schizophrenia',
    title: 'SCHIZOPHRENIA',
    image: require('../../Assets/image/schizophrenia.jpg'),
    description: 'Schizophrenia is a serious mental disorder in which people interpret reality abnormally. It may result in some combination of hallucinations, delusions, and extremely disordered thinking.',
  },
  {
    id: 'bipolar',
    title: 'BIPOLAR',
    image: require('../../Assets/image/biopolar.jpeg'),
    description: 'Bipolar disorder is a mental health condition that causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression).',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (conditions.length === 0){
      return;
    }

    const interval = setInterval(() => {
      if (flatListRef.current && currentIndex < conditions.length - 1) {
        flatListRef.current.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        // Optionally complete onboarding automatically:
        // dispatch(completeOnboarding());
      }
    },800); // auto move every 300ms

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>

        <Image source={item.image} style={styles.image}
        //resizeMode="contain
         />
        <Text style={styles.title} color={COLORS.primary}>{item.title}</Text>
        <Text style={styles.description} color={COLORS.primary}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < conditions.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(completeOnboarding());
      navigation.navigate('Login');
    }
  };


  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
                  <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
                </View>
        {/* <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} /> */}
        {/* <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        ref={flatListRef}
        data={conditions}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.pagination}>
        {conditions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === currentIndex ? COLORS.primary : COLORS.muted },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === conditions.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: COLORS.white,
    width,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 0,
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 150,
    //alignSelf: 'center',
    resizeMode: 'contain',
    justifyContent: 'center',
    left: 70,
    top: 0,
    marginTop:0,
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    ...FONTS.body5,
    color: COLORS.textLight,
  },
  slide: {
    width,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: width * 0.9,
    height: width * 0.9,
    marginTop: 10,
    marginBottom: 20,

    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#ffa',
  },
  description: {
    ...FONTS.body3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  skipContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  skipText: {
    ...FONTS.body5,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
