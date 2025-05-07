import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { selectTest } from '../redux/slices/brainTestSlice'; // Ensure the path is correct

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const BrainTestCard = ({ test, onPress }) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(selectTest(test.id));
    if (onPress) onPress(test);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={test.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.title}>{test.name}</Text>
      <Text style={styles.description}>{test.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: cardWidth * 0.6,
    height: cardWidth * 0.6,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});

export default BrainTestCard;