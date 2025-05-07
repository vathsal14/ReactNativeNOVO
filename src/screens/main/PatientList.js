import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

const PatientList = () => {
  const patients = [
    { id: '1', name: 'Ronald Reagan', age: '45/M', lastVisit: '02/04/2024', status: 'Active' },
    { id: '2', name: 'Anne Alexandra', age: '36/F', lastVisit: '02/03/2024', status: 'Active' },
    { id: '3', name: 'John Doe', age: '29/M', lastVisit: '02/01/2024', status: 'Inactive' },
    { id: '4', name: 'Jane Smith', age: '32/F', lastVisit: '01/28/2024', status: 'Active' },
    { id: '5', name: 'Michael Johnson', age: '40/M', lastVisit: '01/25/2024', status: 'Inactive' },
    { id: '6', name: 'Emily Davis', age: '27/F', lastVisit: '01/22/2024', status: 'Active' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.patientItem}>
      <Text style={styles.patientName}>{item.name}</Text>
      <View style={styles.patientDetails}>
        <Text style={styles.patientAge}>{item.age}</Text>
        <Text style={styles.patientDate}>{item.lastVisit}</Text>
        <Text
          style={[
            styles.patientStatus,
            { color: item.status === 'Active' ? '#4CAF50' : '#F44336' }

          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <View style={styles.logoContainer}>
                  <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
                </View>
        {/* <Text style={styles.title}>NOVO NeuroTech</Text> */}
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Patient List"
        />
      </View>

      <FlatList
        data={patients}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  patientItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  patientAge: {
    color: '#666',
  },
  patientDate: {
    color: '#666',
  },
  patientStatus: {
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
  },
 
});

export default PatientList;
