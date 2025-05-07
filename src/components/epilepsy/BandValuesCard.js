import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setBandValues } from '../../redux/slices/epilepsySlice';
import debounce from 'lodash.debounce';

const BandValuesCard = () => {
  const dispatch = useDispatch();
  const bandValues = useSelector((state) => state.epilepsy.bandValues);
  const [localValues, setLocalValues] = useState(bandValues);

  const handleChange = (key, value) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    debouncedDispatch(key, value);
  };

  const debouncedDispatch = debounce((key, value) => {
    dispatch(setBandValues({ [key]: value }));
  }, 300);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Band_values :</Text>
      <View style={styles.content}>
        {Object.keys(localValues).map((key) => (
          <View style={styles.item} key={key}>
            <Text style={styles.label}>{key.replace('_', '-')}</Text>
            <TextInput
              style={styles.input}
              value={localValues[key]}
              onChangeText={(value) => handleChange(key, value)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C63FF',
    marginBottom: 12,
  },
  content: {
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#333333',
  },
  input: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default BandValuesCard;