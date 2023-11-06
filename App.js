import { SafeAreaView } from 'react-native';
import { ImageBackground } from 'react-native';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { MagnifyingGlassIcon, SparklesIcon } from "react-native-heroicons/solid";
import { useState } from 'react';
import dummyForecast from './dummyForecast';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function App() {

  const [showSearch, toggleSearch] = useState(false);

  const obj = {
    city: "Warszawa",
    country: "Polska",
    temp: "24°",
    description: "Słonecznie"
  }

  const renderForecast = ({item, index}) => {
    return(
      <View key={index} style={styles.forecastItem}>
        <Icon style={styles.forecastItemIcon} name="sunny-outline" size={50} />
        <Text style={styles.forecastItemDay}>{item.day}</Text>
        <Text style={styles.forecastItemTemp}>{item.temp}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.containerPrimary}>
      <View style={styles.container}>
        <View style={{backgroundColor: showSearch? 'rgba(255, 255, 255, 0.5)' : 'transparent', 
          width: width-20,
          height: 60, 
          borderRadius: 50,
          margin: 10,
          paddingLeft: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {showSearch? (<TextInput
            placeholder='Type your city..'
            placeholderTextColor={'#fff'} />) : null}
          <TouchableOpacity
            onPress={() => toggleSearch(!showSearch)}
            style={{backgroundColor: '#fff', height: 60, width: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
            <MagnifyingGlassIcon />
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 10, marginVertical: 50, alignItems: 'center', justifyContent: 'center',}}>
          <Text style={styles.cityText}>{obj.city}, <Text style={styles.countryText}>{obj.country}</Text></Text>
          <Icon name="sunny-outline" size={200} color={"#fff"}/>
          <Text style={{marginTop: 30, color: '#fff', fontSize: 64, fontWeight: 'bold'}}>{obj.temp}</Text>
          <Text style={{color: '#fff', fontSize: 24, marginTop: 10}}>{obj.description}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, marginHorizontal: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="speedometer-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>3.4km</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="water-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>14%</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="sunny-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>05:47</Text>
            </View>
            
          </View>
        </View>

        <View style={{marginHorizontal: 5, marginVertical: 10}}>
          <Text style={styles.forecastTitle}>Forecast</Text>
        </View>

        <FlatList
          data={dummyForecast}
          renderItem={renderForecast}
          keyExtractor={(item, index) => index}
          horizontal />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerPrimary: {
    backgroundColor: "#222",
    flex: 1,
  },

  container: {
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    height: 60,
    borderRadius: 50,
    padding: 20,
    marginHorizontal: 10
  },

  searchIcon: {
  
  },

  cityText: {
    fontSize: 32,
    fontWeight: 800,
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 30
  },

  countryText: {
    fontSize: 26,
    fontWeight: 800,
    color: '#757575'
  },

  forecastTitle : {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },

  forecastItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(122, 122, 122, 0.2)',
    borderRadius: 20,
    marginHorizontal: 10,
    padding: 15
  },

  forecastItemIcon: {
    color: '#fff',
  },

  forecastItemTemp: {
    color: '#f3f3f3',
    fontSize: 18,
    fontWeight: 'bold'
  },

  forecastItemDay: {
    color: '#f3f3f3',
    fontSize: 12
  },

});
