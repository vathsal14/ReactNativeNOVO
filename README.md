# NOVO NeuroTech - Neurological Disease Risk Assessment App

## Overview

This React Native application provides a comprehensive tool for assessing neurological disease risk, including both Parkinson's and Alzheimer's diseases, using various clinical measurements and machine learning models. The app allows healthcare professionals to input patient data, process it through predictive models, and visualize the risk assessment results.

## Features

- **Parkinson's Test Data Entry**: Input DAT scan values, UPDRS scores, smell test results, and cognitive scores
- **Alzheimer's Test Data Entry**: Input MRI-derived measurements including hippocampus volume, cortical thickness, and more
- **Risk Assessment Models**: Process test data through machine learning models to predict disease risk
- **Visual Risk Display**: View color-coded risk levels (Low, Moderate, High) with percentage scores
- **Detailed Results**: Access comprehensive test summaries and recommendations based on risk level
- **Patient Management**: Track patient history and manage multiple assessments

## Model Integration

The application integrates with prediction models for both Parkinson's and Alzheimer's diseases that analyze various clinical markers to assess disease risk.

### Parkinson's Disease Model
The Parkinson's model takes into account:
- DAT scan measurements (caudate and putamen ratios)
- UPDRS (Unified Parkinson's Disease Rating Scale) scores
- Smell test performance
- Cognitive assessment scores

### Alzheimer's Disease Model
The Alzheimer's model analyzes MRI-derived measurements including:
- Hippocampus volume (cm³)
- Cortical thickness (mm)
- Ventricle volume (cm³)
- White matter hyperintensities
- Brain glucose metabolism (SUV)
- Amyloid deposition (SUVR)
- Tau protein level (SUVR)

## Project Structure

### Frontend (React Native)
- `src/api/parkinsonModelService.js`: Service for interacting with the Parkinson's prediction model
- `src/api/alzheimerModelService.js`: Service for interacting with the Alzheimer's prediction model
- `src/screens/main/ParkinsonTestScreen.js`: Screen for inputting Parkinson's test data and viewing risk assessment
- `src/screens/main/AlzheimerTestScreen.js`: Screen for inputting Alzheimer's test data and viewing risk assessment
- `src/redux/slices/`: Redux state management for test data

### Backend (Python)
- `backend/fixed_pure_parkinson_server.py`: Flask server for Parkinson's risk prediction using PKL model
- `backend/enhanced_alzheimer_server.py`: Flask server for Alzheimer's risk prediction using PKL model
- `model/`: Directory containing the model files (PKL format)
  - `Parkinson_Model.pkl`: Trained model for Parkinson's disease risk prediction
  - `alz_model.pkl`: Trained model for Alzheimer's disease risk prediction
  - `scaler.pkl` & `scaler_y.pkl`: Feature scalers for the models

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
