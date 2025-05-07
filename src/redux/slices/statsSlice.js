import { createSlice } from "@reduxjs/toolkit"

/**
 * @typedef {Object} StatsState
 * @property {number} totalPatients - Total number of patients
 * @property {number} consultations - Number of consultations
 * @property {number} surgeries - Number of surgeries
 * @property {number} newPatients - Number of new patients
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 */

/** @type {StatsState} */
const initialState = {
  totalPatients: 1589,
  consultations: 236,
  surgeries: 304,
  newPatients: 132,
  loading: false,
  error: null,
}

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    /**
     * Start fetching stats
     * @param {StatsState} state - Current state
     */
    fetchStatsStart: (state) => {
      state.loading = true
      state.error = null
    },
    /**
     * Successfully fetched stats
     * @param {StatsState} state - Current state
     * @param {Object} action - Action with payload containing stats to update
     */
    fetchStatsSuccess: (state, action) => {
      return { ...state, ...action.payload, loading: false }
    },
    /**
     * Failed to fetch stats
     * @param {StatsState} state - Current state
     * @param {Object} action - Action with payload containing error message
     */
    fetchStatsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    /**
     * Update a specific stat
     * @param {StatsState} state - Current state
     * @param {Object} action - Action with payload containing key and value to update
     */
    updateStat: (state, action) => {
      const { key, value } = action.payload
      if (key in state && key !== "loading" && key !== "error") {
        state[key] = value
      }
    },
  },
})

export const { fetchStatsStart, fetchStatsSuccess, fetchStatsFailure, updateStat } = statsSlice.actions
export default statsSlice.reducer
