This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

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

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.
