"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useSelector } from "react-redux"
import Header from "../components/Header"
import WelcomeCard from "../components/WelcomeCard"
import ReportCard from "../components/ReportCard"
import WeeklyChart from "../components/WeeklyChart"
import PeriodSelector from "../components/PeriodSelector"
import { useTheme } from "../theme/ThemeProvider"

const DashboardScreen = () => {
  const { colors } = useTheme()
  const { name } = useSelector((state) => state.user)
  const { todayCount } = useSelector((state) => state.schedules)
  const { positiveCount, negativeCount } = useSelector((state) => state.reports)
  const { weeklyData } = useSelector((state) => state.schedules)

  const [selectedPeriod, setSelectedPeriod] = useState("This Week")

  // These would normally be imported from assets
  const positiveIcon = { uri: "https://cdn-icons-png.flaticon.com/512/3209/3209145.png" }
  const negativeIcon = { uri: "https://cdn-icons-png.flaticon.com/512/3209/3209138.png" }
  const neutralIcon = { uri: "https://cdn-icons-png.flaticon.com/512/3209/3209204.png" }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dashboardTitle}>Dash board</Text>

        <WelcomeCard name="Dr. Jessica Lenda" scheduleCount={todayCount} />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Reports</Text>

          <View style={styles.reportsContainer}>
            <View style={styles.reportCard}>
              <ReportCard title="Positive" count={positiveCount} icon={positiveIcon} isActive={true} />
            </View>

            <View style={styles.reportCard}>
              <ReportCard title="Negative" count={negativeCount} icon={negativeIcon} />
            </View>

            <View style={styles.reportCard}>
              <ReportCard title="Neutral" count={0} icon={neutralIcon} />
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <PeriodSelector initialValue={selectedPeriod} onSelect={setSelectedPeriod} />
          </View>

          <WeeklyChart data={weeklyData} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 16,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  reportsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  chartContainer: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
})

export default DashboardScreen
