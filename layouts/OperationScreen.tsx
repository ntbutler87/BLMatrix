import React from 'react';
import { useWindowDimensions } from 'react-native';
import { MatrixStatus } from '../config/MatrixSDK';
import { AppConfig } from '../config/AppSettings';
import OperationTabInputMapping from './OperationTabInputMapping';
import { TabView, SceneMap } from 'react-native-tab-view';
import OperationTabScenes from './OperationTabScenes';
import OperationTabOutputMapping from './OperationTabOutputMapping';

interface Props {
  matrixStatus: MatrixStatus;
  appConfig: AppConfig;
}
function OperationScreen({matrixStatus, appConfig}: Props): React.JSX.Element {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Scenes', title: 'Scenes' },
    { key: 'Inputs', title: 'Input Mapping' },
    { key: 'Outputs', title: 'Output Mapping' },
  ]);
  
  const ScenesTab = () => {
    return <OperationTabScenes appConfig={appConfig} matrixStatus={matrixStatus}/>;
  }
  const InputsTab = () => {
    return <OperationTabInputMapping appConfig={appConfig} matrixStatus={matrixStatus}/>;
  }
  const OutputsTab = () => {
    return <OperationTabOutputMapping appConfig={appConfig} matrixStatus={matrixStatus}/>;
  }

  const renderScene = SceneMap({
    Scenes: ScenesTab,
    Inputs: InputsTab,
    Outputs: OutputsTab,
  });
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default OperationScreen;
