// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { COLORS } from '../../constants/theme';

// const PatientDetailsScreen = ({ route }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Patient Details Screen</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   text: {
//     fontSize: 18,
//     color: COLORS.black,
//   },
// });

// export default PatientDetailsScreen;

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PatientDetail = ({ route }) => {
  const { patient } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Patient Information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.patientHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.patientHeaderInfo}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientId}>Patient ID: PT-{1000 + patient.id}</Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[styles.statusText, patient.status === 'Active' ? styles.activeStatus : styles.overdueStatus]}
                >
                  {patient.status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{patient.age} years</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Sex</Text>
                <Text style={styles.infoValue}>{patient.sex === 'M' ? 'Male' : 'Female'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Last Visit</Text>
                <Text style={styles.infoValue}>{patient.lastVisit}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Next Appointment</Text>
                <Text style={styles.infoValue}>
                  {new Date(new Date(patient.lastVisit).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="phone" size={16} color="#4169E1" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="calendar-plus" size={16} color="#4169E1" />
              <Text style={styles.actionButtonText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="file-medical" size={16} color="#4169E1" />
              <Text style={styles.actionButtonText}>Records</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medical History</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalDate}>10/15/2023</Text>
            <View style={styles.medicalContent}>
              <Text style={styles.medicalTitle}>Routine Checkup</Text>
              <Text style={styles.medicalDescription}>
                Patient reported mild headaches. Prescribed acetaminophen as needed.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.medicalItem}>
            <Text style={styles.medicalDate}>08/22/2023</Text>
            <View style={styles.medicalContent}>
              <Text style={styles.medicalTitle}>Neurological Assessment</Text>
              <Text style={styles.medicalDescription}>
                Comprehensive neurological assessment performed. Results within normal range.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.medicalItem}>
            <Text style={styles.medicalDate}>05/10/2023</Text>
            <View style={styles.medicalContent}>
              <Text style={styles.medicalTitle}>Initial Consultation</Text>
              <Text style={styles.medicalDescription}>
                Patient presented with concerns about memory issues. Recommended cognitive assessment.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 15,
    backgroundColor: '#4169E1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientHeaderInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeStatus: {
    color: 'green',
    backgroundColor: 'rgba(0, 128, 0, 0.1)',
  },
  overdueStatus: {
    color: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 5,
    color: '#4169E1',
    fontWeight: '500',
  },
  sectionHeader: {
    padding: 15,
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medicalItem: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  medicalDate: {
    width: 80,
    fontSize: 12,
    color: '#666',
  },
  medicalContent: {
    flex: 1,
  },
  medicalTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  medicalDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
});

export default PatientDetail;
