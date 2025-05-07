'use client';

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients, searchPatients, selectPatient } from '../../redux/slices/patientsSlice';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomTabBar from '../../components/CustomTabBar';

const EmptyPatientList = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No patients found</Text>
  </View>
);

const PatientListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const patients = useSelector((state) => state?.patients || {});
  const { filteredList = [], status = 'idle', searchQuery = '', error } = patients;

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (text) => {
    dispatch(searchPatients(text));
  };

  const renderPatientItem = ({ item, index }) => {
    if (!item) return null;

    const isOverdue = item.status === 'overdue';

    return (
      <TouchableOpacity
        style={styles.patientItem}
        onPress={() => {
          dispatch(selectPatient(item.id)); // Dispatch the action to set the selected patient
          navigation.navigate('PatientDetailsScreen'); // Navigate to the details screen
        }}
      >
        <Text style={styles.serialNumber}>{index + 1}.</Text>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name || 'N/A'}</Text>
          <Text style={styles.patientAge}>
            {`${item.age || '-'} / ${item.sex || '-'}`}
          </Text>
        </View>
        <Text style={styles.visitDate}>{item.lastVisit || '-'}</Text>
        <Text style={[styles.status, isOverdue ? styles.overdueStatus : styles.activeStatus]}>
          {item.status || 'Unknown'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load patients. Please try again later.</Text>
        <TouchableOpacity onPress={() => dispatch(fetchPatients())}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
      <CustomTabBar navigation={navigation} />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../Assets/image/Novologo.png')} style={styles.logo} />
          <View style={styles.iconContainer}>
            <Icon name="bell" size={30} color="#4169E1" />
            <View style={styles.notificationBadge} />
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Patient List</Text>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(!showFilter)}>
            <Text style={styles.filterText}>Filter</Text>
            <Icon name="chevron-down" size={12} color="#4169E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, styles.serialColumn]}>S.no</Text>
        <Text style={[styles.columnHeader, styles.nameColumn]}>Patient Name</Text>
        <Text style={[styles.columnHeader, styles.ageColumn]}>Age/Sex</Text>
        <Text style={[styles.columnHeader, styles.dateColumn]}>Last visit date</Text>
        <Text style={[styles.columnHeader, styles.statusColumn]}>Status</Text>
      </View>

      <FlatList
        data={filteredList || []} // Ensure filteredList is always an array
        renderItem={renderPatientItem}
        keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={EmptyPatientList} // Show fallback UI if the list is empty
      />

      <View style={styles.pagination}>
        <TouchableOpacity style={styles.paginationButton}>
          <Text style={styles.paginationText}>{'< Prev'}</Text>
        </TouchableOpacity>
        <View style={styles.pageNumbers}>
          <TouchableOpacity style={styles.pageNumberActive}>
            <Text style={styles.pageNumberTextActive}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pageNumber}>
            <Text style={styles.pageNumberText}>2</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumberText}>...</Text>
          <TouchableOpacity style={styles.pageNumber}>
            <Text style={styles.pageNumberText}>29</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.paginationButton}>
          <Text style={styles.paginationText}>{'Next >'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 0,
    backgroundColor: '#ffffff',
    //borderBlockColor: '000000',
  },
  logoContainer: {
    flex:1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // logoCircle: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // logoText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#4169E1',
  // },
  iconContainer: {
    position: 'relative',
    marginRight: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  searchContainer: {
    padding: 10,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4169E1',
    marginBottom: 5,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  filterText: {
    color: '#4169E1',
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#4169E1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    //left: 50  ,
  },
  serialColumn: {
    width: '8%',
    left: 12,
  },
  nameColumn: {
    width: '20%',
    left: 25,
  },
  ageColumn: {
    width: '15%',
    left:40,
  },
  dateColumn: {
    width: '30%',
    left: 50,
  },
  statusColumn: {
    width: '22%',
    left: 50,
  },
  listContainer: {
    paddingBottom: 10,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems:'left',
    justifyContent: 'space-between',
    //alignItems: 'center',
    left:10,
    paddingVertical:6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',

    // top:20,
    
    //ttom: 0,
  },
  serialNumber: {
    width: '5%',
    fontSize: 12,
    // left: 12,
  },
 
  patientName: {
    fontSize: 12,
    fontWeight: '500',
  // right:5,
  
    color: '#333',
  },
  patientAge: {
    fontSize: 12,
    color: '#666',
    left: 100,
    fontWeight: '500',
    bottom:20,
   
  },
  visitDate: {
    width: '25%',
    fontSize: 12,
    left:40,
    top:10,
    fontWeight: '500',
  },
  status: {
    width: '22%',
    fontSize: 12,
    fontWeight: '500',
    left: 30,
  },
  activeStatus: {
    color: 'green',
  },
  overdueStatus: {
    color: 'red',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationButton: {
    padding: 5,
  },
  paginationText: {
    color: '#4169E1',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumber: {
    marginHorizontal: 5,
  },
  pageNumberActive: {
    backgroundColor: '#4169E1',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pageNumberText: {
    color: '#4169E1',
  },
  pageNumberTextActive: {
    color: 'white',
  },
  footer: {
    backgroundColor: '#FFD700',
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#4169E1',
    fontWeight: 'bold',
  },
  // logoContainer: {
  //   alignItems: 'center',
  //   marginBottom: 0,
  // },
  logo: {
    width: 100,
    height: 100,
    //resizeMode: 'contain',
    marginTop:0,
    overflow:'scroll',
    //marginRight: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#4169E1',
  },
});

export default PatientListScreen;


