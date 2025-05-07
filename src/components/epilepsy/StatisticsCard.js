import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setStatistics } from '../../redux/slices/epilepsySlice';

const StatisticsCard = () => {
  const dispatch = useDispatch();
  const statistics = useSelector((state) => state.epilepsy.statistics) || {
    mean: '',
    variance: '',
    std_dev: '',
    skewness: '',
    kurtosis: '',
    entropy: '',
  };

  const handleChange = (key, value) => {
    dispatch(setStatistics({ [key]: value }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Mean</Text>
          <TextInput
            style={styles.input}
            value={statistics.mean}
            onChangeText={(value) => handleChange('mean', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Variance</Text>
          <TextInput
            style={styles.input}
            value={statistics.variance}
            onChangeText={(value) => handleChange('variance', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Std_dev</Text>
          <TextInput
            style={styles.input}
            value={statistics.std_dev}
            onChangeText={(value) => handleChange('std_dev', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Skewness</Text>
          <TextInput
            style={styles.input}
            value={statistics.skewness}
            onChangeText={(value) => handleChange('skewness', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Kurtosis</Text>
          <TextInput
            style={styles.input}
            value={statistics.kurtosis}
            onChangeText={(value) => handleChange('kurtosis', value)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Entropy</Text>
          <TextInput
            style={styles.input}
            value={statistics.entropy}
            onChangeText={(value) => handleChange('entropy', value)}
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

export default StatisticsCard;