import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addPrescription } from '../../redux/slices/patientsSlice'; // Corrected import path
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const PatientDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentPatient = useSelector((state) => state.patients.selectedPatient); // Corrected selector

  if (!currentPatient) {
    return (
      <View style={styles.noPatientContainer}>
        <Text style={styles.noPatientText}>No patient selected</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('PatientListScreen')}>
          <Text style={styles.backButtonText}>Go to Patient List</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddPrescription = () => {
    const newPrescription = {
      id: Date.now(), // Unique ID for the prescription
      medication: 'New Medication',
      date: '12/07/2023',
      duration: '7 days',
    };
    dispatch(addPrescription(newPrescription)); // Dispatch the action to add the prescription
  };

  // Provide default values for testReports and prescriptions if they are undefined
  const testReports = currentPatient.testReports || [];
  const prescriptions = currentPatient.prescriptions || [];

  // Provide a default value for healthMetrics if it's undefined
  const healthMetrics = currentPatient.healthMetrics || {
    heartRate: 'N/A',
    bodyTemperature: 'N/A',
    glucose: 'N/A',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>NOVO NeuroTech</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            {/* <Bell color="#000" size={24} /> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            {/* <User color="#000" size={24} /> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Patient Details</Text>

        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientInfo}>
            <View style={styles.profileSection}>
              <Image
                source={
                  currentPatient.profileImage
                    ? { uri: currentPatient.profileImage }
                    //: require('../../Assets/image/profile-image.jpeg') // Fallback image
                    : require('../../Assets/image/profile-image.jpg') // Fallback image
                }
                style={styles.profileImage}
              />
              <Text style={styles.patientName}>{currentPatient.name}</Text>
              <Text style={styles.patientAge}>Age: {currentPatient.age}</Text>
              <TouchableOpacity style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailsSection}>
              <Text style={styles.infoHeader}>Information:</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gender:</Text>
                <Text style={styles.infoValue}>{currentPatient.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Blood Type:</Text>
                <Text style={styles.infoValue}>{currentPatient.bloodType}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Allergies:</Text>
                <Text style={styles.infoValue}>{currentPatient.allergies}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Diseases:</Text>
                <Text style={styles.infoValue}>{currentPatient.diseases}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height:</Text>
                <Text style={styles.infoValue}>{currentPatient.height}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{currentPatient.weight}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Patient ID:</Text>
                <Text style={styles.infoValue}>{currentPatient.patientID}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Visit:</Text>
                <Text style={styles.infoValue}>{currentPatient.lastVisit}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            {/* <Heart color="#FF5252" size={24} /> */}
            <Text style={styles.metricTitle}>Heart Rate</Text>
            <Text style={styles.metricValue}>
              {healthMetrics.heartRate}
              <Text style={styles.metricUnit}> bpm</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            {/* <Thermometer color="#FFA726" size={24} /> */}
            <Text style={styles.metricTitle}>Body Temperature</Text>
            <Text style={styles.metricValue}>
              {healthMetrics.bodyTemperature}
              <Text style={styles.metricUnit}>°C</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            {/* <Droplet color="#42A5F5" size={24} /> */}
            <Text style={styles.metricTitle}>Glucose</Text>
            <Text style={styles.metricValue}>
              {healthMetrics.glucose}
              <Text style={styles.metricUnit}> mg/dL</Text>
            </Text>
          </View>
        </View>

        {/* Test Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Test Reports</Text>
          <View style={styles.reportsContainer}>
            {testReports.length > 0 ? (
              testReports.map((report) => (
                <View key={report.id} style={styles.reportItem}>
                  <View
                    style={[
                      styles.reportIcon,
                      {
                        backgroundColor:
                          report.type === "blood" ? "#E8F5E9" : report.type === "scan" ? "#FFF3E0" : "#FFEBEE",
                      },
                    ]}
                  >
                    {/* <FileText
                      color={report.type === "blood" ? "#4CAF50" : report.type === "scan" ? "#FF9800" : "#F44336"}
                      size={20}
                    /> */}
                  </View>
                  <Text style={styles.reportName}>{report.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No test reports available</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BrainTestScreen')} // Navigate to BrainTestScreen
          >
            <Text style={styles.buttonText}>Go to Brain Test</Text>
          </TouchableOpacity>
        </View>

        {/* Prescriptions */}
        <View style={styles.prescriptionsSection}>
          <Text style={styles.sectionTitle}>Prescriptions</Text>
          <TouchableOpacity style={styles.addPrescriptionButton} onPress={handleAddPrescription}>
            {/* <PlusCircle color="#4CAF50" size={16} /> */}
            <Text style={styles.addPrescriptionText}>Add a prescription</Text>
          </TouchableOpacity>

          <View style={styles.prescriptionsList}>
            <View style={styles.prescriptionHeader}>
              <Text style={styles.prescriptionHeaderText}>Prescriptions</Text>
              <Text style={styles.prescriptionHeaderText}>Date</Text>
              <Text style={styles.prescriptionHeaderText}>Duration</Text>
            </View>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <View key={prescription.id} style={styles.prescriptionItem}>
                  <View style={styles.prescriptionNameContainer}>
                    <View style={styles.prescriptionIcon}>
                      {/* <FileText color="#FF9800" size={16} /> */}
                    </View>
                    <Text style={styles.prescriptionName}>{prescription.name}</Text>
                  </View>
                  <Text style={styles.prescriptionDate}>{prescription.date}</Text>
                  <Text style={styles.prescriptionDuration}>{prescription.duration}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No prescriptions available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noPatientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noPatientText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4a3aa9',
    borderRadius: 4,
    padding: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    marginHorizontal: 16,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  patientInfo: {
    flexDirection: "row",
  },
  profileSection: {
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: 100, // Adjust the size as needed
    height: 100,
    borderRadius: 50, // Makes the image circular
    borderWidth: 2,
    borderColor: '#6C63FF', // Optional border color
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  patientAge: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsSection: {
    flex: 1,
  },
  infoHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6a5acd",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 90,
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 12,
  },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "31%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: "normal",
  },
  reportsSection: {
    marginVertical: 12,
  },
  reportsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
  },
  reportItem: {
    alignItems: "center",
    marginRight: 16,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  reportName: {
    fontSize: 12,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginTop: 8,
  },
  prescriptionsSection: {
    marginVertical: 12,
  },
  addPrescriptionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  addPrescriptionText: {
    color: "#4CAF50",
    marginLeft: 4,
    fontSize: 14,
  },
  prescriptionsList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prescriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  prescriptionHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  prescriptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  prescriptionNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  prescriptionIcon: {
    marginRight: 8,
  },
  prescriptionName: {
    fontSize: 14,
    fontWeight: "500",
  },
  prescriptionDate: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  prescriptionDuration: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    backgroundColor: '#6C63FF',
    padding: 26,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PatientDetailsScreen;

