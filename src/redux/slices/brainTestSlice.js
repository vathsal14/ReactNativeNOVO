import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tests: [
    {
      id: '1',
      name: 'Parkinson',
      image: require('../../Assets/image/parkinson-card.jpeg'),
    },
    {
      id: '2',
      name: 'Alzheimer',
      image: require('../../Assets/image/Alzheimers-cards.jpg'),
    },
    {
      id: '3',
      name: 'Epilepsy',
      image: require('../../Assets/image/epilepsy-card.jpeg'),
    },
    {
      id: '4',
      name: 'Schizophrenia',
      image: require('../../Assets/image/schizophrenia-card.jpeg'),
    },
    {
      id: '5',
      name: 'Bi-polar',
      image: require('../../Assets/image/bipolar-card.jpeg'),
    },
  ],
  selectedTest: null,
};

export const brainTestSlice = createSlice({
  name: 'brainTest',
  initialState,
  reducers: {
    selectTest: (state, action) => {
      state.selectedTest = action.payload;
    },
    clearSelectedTest: (state) => {
      state.selectedTest = null;
    },
  },
});

export const { selectTest, clearSelectedTest } = brainTestSlice.actions;

// Selectors
export const selectAllTests = (state) => state.brainTest.tests;
export const selectSelectedTest = (state) => state.brainTest.selectedTest;

export default brainTestSlice.reducer;