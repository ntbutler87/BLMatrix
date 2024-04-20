/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useRef, LegacyRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import InputPort from './components/InputPort';

import matrixSDK, { MatrixStatus } from './config/MatrixSDK';
import OutputPort from './components/OutputPort';
import InputTile from './components/InputTile';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [matrixIP, setMatrixIP] = useState<string | null>(null);
  const [matrixStatus, setMatrixStatus] = useState<MatrixStatus | null>(null);
  const ipInput = useRef(null);
  const [text, setText] = useState('');
  const [selectedOutput, setSelectedOutput] = useState(null);

  const isDarkMode = useColorScheme() === 'dark';

  const updateStatusState = (state: MatrixStatus) => {
    console.log("Updating local matrixState - should re-render...");
    setMatrixStatus({...state});
  }

  useEffect( () => {
    Promise.resolve(matrixSDK.init(updateStatusState)).catch( (e) => {console.log(e)} );
    Promise.resolve(matrixSDK.getCurrentIP).then((value) => {setMatrixIP(value)});
    console.log("MatrixIP Currently: " + matrixIP);
    // if (matrixIP === null) {
    //   Promise.resolve(matrixSDK.setIPAddress("127.0.0.1:8000"));
    // }
 
    return ( () => { Promise.resolve(matrixSDK.stopConnection()); } )
  }, [matrixIP]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Section title='Inputs'>
          </Section>
          <View style={{flex: 1, flexDirection: 'row', flexWrap:'wrap', justifyContent: 'space-evenly', rowGap: 10}} >
            {matrixStatus?.HDMI_IN.map(data => {
              return <InputTile  key={"HDMI_IN"+data.port} 
                                  disabled={false} 
                                  port={data} 
                                  outputs={matrixStatus?.HDMI_OUT.filter( (val) => {return val.input == data.port} ) }
                                  />
            })}
          </View>
          <Section title='Outputs'>
          </Section>
          <View style={{flex: 1, flexDirection: 'row', flexWrap:'wrap', justifyContent: 'space-evenly', rowGap: 10}} >
            {matrixStatus?.HDMI_OUT.map(data => {
                return <OutputPort  key={"OUTPUTS"+data.port} 
                                    disabled={false} 
                                    hdmiPort={data} 
                                    inputPort={matrixStatus.HDMI_IN.find((val) => {return val.port == data.input})} 
                                    hdbtPort={matrixStatus.HDBT_OUT[data.port - 1]} 
                                    
                                    />
              })}
            </View>
          <Section title='Connection Details'>
          </Section>
          <TextInput
              style={styles.input}
              ref={ipInput}
              placeholder="Enter an IP address"
              onChangeText={(e) => {
                  ipInput.current.value = e; console.log(ipInput.current.value)
                }}
              defaultValue={matrixIP ? matrixIP : ""}
            />
          <TouchableOpacity
            onPress={() => {
              matrixSDK.setIPAddress(ipInput.current.value);
              setMatrixIP(ipInput.current.value);
            }} 
            style={styles.btn} >
            <Text>Update IP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {matrixSDK.setOutputSource(7,1)}}>
            <Text>In1 to Out7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {matrixSDK.setOutputSource(7,3)}}>
            <Text>In3 to Out7</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgb(7, 68, 148)',
    // backgroundColor: 'rgb(255, 255, 255)',
  },
  sectionContainer: {
    flex:1,
    marginTop: 32,
    paddingHorizontal: 24,
    
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  btn: {
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: 'rgb(250,250,250)',
  },
  input: {
    padding: 15,
    height: 100,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default App;
