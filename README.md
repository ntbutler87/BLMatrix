This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# General Info
This was meant to be an app released for iPad and eventually Android too, to control the BrightLink BL-8X8-HDBT-HD20 Brightlink Pro Series HDMI 2.0 8x8/8x16/8x24 HDMI / HDBaseT Matrix. At this stage, Apple have refused to publish the app, so feel free to take this and try to build it yourself and side load it to a device that works for you. No real effort has been done yet to check Android compatibility.

## Screenshots
### Splash screen
Splash screen that the app will return to after a set amount of time (BUG: set amount of time, not inactivity! Still need to figure out how to handle "inactivity" in react native)
![App Splash Screen](/resources/splash.png)
### Scene Select Screen
8 customisable Scene Selection buttons.
This same sort of functionality is also reproduced in a separate "Macros" screen. The Macros process individual input/output routing commands at once, which is faster than the Scenes functionality, and if being used in the middle of a presentation, Macros are likely what you will want to use instead of scenes.
![Scenes Screen](/resources/scenes.png)
### Input mapping summary screen
Screen showing the current signal routing setup
![Input Mapping Screen](/resources/inputmapping.png)
### Input to Output routing selection screen
Screen allowing you to select multiple outputs for a given input. E.g. send your main PC image to any from 1 to 8 outputs.
![Input Mapping Output Selector](/resources/mapping2.png)

# Getting Started

>**Note**: Good luck - if you're anything like me, getting React Native set up and running is half a day of screwing around with things that just don't work out of the box. Patience is a virtue....

## Step 1: Start the Metro Server

```bash
# Clone the repo
git clone https://github.com/ntbutler87/BLMatrix.git
cd BLMatrix

# Install packages
npm install

# Install iOS Pods
cd ios && pod install && ..

# Run the app >> CHANGE THE SIMULATOR NAME to match your simulator device name
npm run ios -- --simulator="iPad Air (5th generation)"
```

## Step 2: Connect to your matrix
1. Open the app
2. Go to the Settings area (default PIN 000000)
3. Enter the IP address of the HDMI matrix

## Step 2b: If you don't own a matrix yet, try the simulator...
If you don't have a matrix yet, I have tried to replicate at least the basic functionality in a nodeJS server.
Clone the repot for this from https://github.com/ntbutler87/BLMatrixServer
Run npm install, then npm start, and then you should be able to connect the app to the server running on port 3000 on your local device

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
