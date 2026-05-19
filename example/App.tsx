import WithCustomPath from 'on-location-changed/with-custom-path';
import useLocationPath from 'on-location-changed/use-location-path';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function App() {
  return (
    <WithCustomPath path="/example">
      <ExampleScreen />
    </WithCustomPath>
  );
}

function ExampleScreen() {
  const path = useLocationPath();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>on-location-changed example</Text>
        <Group name="Location path">
          <Text>{path}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
};
