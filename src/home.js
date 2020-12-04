import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Feather from 'react-native-vector-icons/dist/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = (props) => {
  const [value, setValue] = useState([]);
  const [change, setChange] = useState({id: null, msg: null});

  const storeData = async () => {
    if (change.msg === null) {
      Alert.alert('Ops..!', 'masukan catatan anda...');
    } else {
      const newValue = [{...change}, ...value];
      proses(newValue);
    }
  };

  const proses = async (newValue) => {
    await AsyncStorage.setItem('@storage_Key', JSON.stringify(newValue))
      .then(() => {
        setChange({id: null, msg: null});
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getData = async () => {
    try {
      await AsyncStorage.getItem('@storage_Key').then((r) => {
        const parsedTodos = JSON.parse(r);
        if (!parsedTodos || typeof parsedTodos !== 'object') return;
        setValue(parsedTodos);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const removeValue = async (id, status) => {
    const fil = value.filter((v) => v.id !== id);
    let newValue = [...fil];
    proses(newValue);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{backgroundColor: '#F0F0F0', flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.Text}>Abdul Gopur</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.wrapAction}>
          <View style={{flex: 1}}>
            <TextInput
              onChangeText={(e) => {
                const key = Math.random().toString();
                setChange({id: key, msg: e});
              }}
              value={change.msg}
              style={{
                borderWidth: 1,
                borderColor: 'green',
                borderRadius: 5,
                color: 'green',
                paddingHorizontal: 10,
              }}
            />
          </View>
          <View style={{flex: 0.2}}>
            <TouchableOpacity style={styles.button} onPress={() => storeData()}>
              <FontAwesome5 name="save" color="green" size={25} />
              <Text style={{color: 'green'}}>save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            padding: 20,
          }}>
          <ScrollView>
            {value.length < 1 ? (
              <Text style={{fontSize: 18, color: 'green', textAlign: 'center'}}>
                silahkan tulis kegiatan apa aja...
              </Text>
            ) : (
              value.map((i, key) => (
                <View
                  style={{flexDirection: 'row', padding: 4, margin: 5}}
                  key={key}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => removeValue(i.id)}>
                      <Feather name="trash" color="green" size={25} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginLeft: 15,
                    }}>
                    <Text style={{fontSize: 18, color: 'green'}}>{i.msg}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  Text: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  wrapAction: {
    marginTop: 10,
    height: 60,
    flexDirection: 'row',
    padding: 10,
  },
  button: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default App;
