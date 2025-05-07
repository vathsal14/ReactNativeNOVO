import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFrequency } from '../../redux/slices/epilepsySlice';

const FrequencyCard = () => {
  const dispatch = useDispatch();
  const frequency = useSelector((state) => state.epilepsy.frequency) || {
    fit_mean: '',
    fit_variance: '',
    fit_std_dev: '',
    fit_skewness: '',
    fit_kurtosis: '',
  };

  const handleChange = (key, value) => {
    dispatch(setFrequency({ [key]: value }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Fit Mean</Text>
          <TextInput
            style={styles.input}
            value={frequency.fit_mean}
            onChangeText={(value) => handleChange('fit_mean', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Fit Variance</Text>
          <TextInput
            style={styles.input}
            value={frequency.fit_variance}
            onChangeText={(value) => handleChange('fit_variance', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Fit Std Dev</Text>
          <TextInput
            style={styles.input}
            value={frequency.fit_std_dev}
            onChangeText={(value) => handleChange('fit_std_dev', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Fit Skewness</Text>
          <TextInput
            style={styles.input}
            value={frequency.fit_skewness}
            onChangeText={(value) => handleChange('fit_skewness', value)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Fit Kurtosis</Text>
          <TextInput
            style={styles.input}
            value={frequency.fit_kurtosis}
            onChangeText={(value) => handleChange('fit_kurtosis', value)}
            keyboardType="numeric"
          />
        </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
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

export default FrequencyCard;