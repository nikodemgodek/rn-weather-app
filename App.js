import { SafeAreaView } from 'react-native';
import { ImageBackground } from 'react-native';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';
import { MagnifyingGlassIcon, SparklesIcon } from "react-native-heroicons/solid";
import { useCallback, useState, useEffect } from 'react';
import dummyForecast from './dummyForecast';

import { fetchWeatherForecast } from './api/weather';
import { fetchLocations } from './api/weather';

import { debounce } from 'lodash';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function App() {

  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = loc => {
    console.log('selected location: ', loc);
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      console.log('got forecast: ', data);
      setWeather(data);
      setLoading(false);
    })

  }

  const handleSearch = value => {
    if(value.length > 2 ) {
      fetchLocations({cityName: value}).then(data => {
        console.log('got locations: ', data);
        setLocations(data);
      });
    }
  }

  const { current, location } = weather;
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const renderForecast = ({item, index}) => {
    return(
      weather?.forecast?.forecastday?.map( (item, index) => {

        let date = new Date(item.date);
        let options = {weekday: 'long'};
        let dayName = date.toLocaleDateString('en-US', options);
        dayName = dayName.split(',')[0];

        return(
          <View key={index} style={styles.forecastItem}>
            <Image style={{width: 50, height: 50}} source={{ uri: `https:${item?.day?.condition?.icon}` }} />
            <Text style={styles.forecastItemDay}>{dayName}</Text>
            <Text style={styles.forecastItemTemp}>{item.day.avgtemp_c ? `${Math.round(item.day.avgtemp_c)}°` : `--°`}</Text>
          </View>
        )
      })

    )
  }

  const fetchWeatherData = async () => {
    setLoading(true);
    fetchWeatherForecast({
      cityName: 'Cambridge',
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
    })
  }

  useEffect( () => {
    fetchWeatherData();
  }, [])

  return (
    <SafeAreaView style={styles.containerPrimary}>
      { loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#fff"/>
        </View>
      ) : null }

      {!loading ? 
      (
        <View style={styles.container}>
          <View style={{backgroundColor: showSearch? 'rgba(255, 255, 255, 0.5)' : 'transparent', 
            width: width-20,
            height: 60, 
            borderRadius: 50,
            margin: 10,
            paddingLeft: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {showSearch? (<TextInput
              onChangeText={handleTextDebounce}
              placeholder='Type your city..'
              placeholderTextColor={'#fff'} />) : null}
            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{backgroundColor: '#fff', height: 60, width: 60, borderRadius: 50, alignItems: 'center', justifyContent: 'center'}}>
              <MagnifyingGlassIcon />
            </TouchableOpacity>
          </View>
          {locations.length>0 && showSearch? (
            <View style={styles.hintList}>
              {locations.map((loc, index) => {
                return(
                  <TouchableOpacity onPress={() => handleLocation(loc)} style={styles.hintListItem} key={index}>
                    <Icon style={{marginRight: 5}} name="location-outline" size={20}/>
                    <Text>{loc?.name}, {loc?.country}</Text>
                  </TouchableOpacity>
                )
          })}
        </View>
        ) : null}
        
        <View style={{marginHorizontal: 10, marginVertical: 50, alignItems: 'center', justifyContent: 'center',}}>
          <Text style={styles.cityText}>{location?.name}, <Text style={styles.countryText}>{location?.country}</Text></Text>
          <Image style={styles.weatherImage} source={{ uri: `https:${current?.condition?.icon}` }}/>
          <Text style={{marginTop: 30, color: '#fff', fontSize: 64, fontWeight: 'bold'}}>{current?.temp_c ? `${current?.temp_c}°` : `--°`}</Text>
          <Text style={{color: '#fff', fontSize: 24, marginTop: 10}}>{current?.condition.text}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30, marginHorizontal: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="speedometer-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>{current?.wind_kph} kph</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="water-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>{current?.humidity}%</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center'}}>
              <Icon color="#fff" name="sunny-outline" size={20} />
              <Text style={{color: '#fff', marginLeft: 5}}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
            </View>
            
          </View>
        </View>

        <View style={{marginHorizontal: 5, marginVertical: 10}}>
          <Text style={styles.forecastTitle}>Forecast (7 days)</Text>
        </View>

        <FlatList
          data={dummyForecast}
          renderItem={renderForecast}
          keyExtractor={(item, index) => index}
          horizontal />
        </View>
      ) : null }
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

  weatherImage: {
    width: 150,
    height: 150
  },

  hintList: {
    position: 'absolute',
    top: 80,
    left: 5,
    width: width-30,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    zIndex: 1
  },

  hintListItem: {
    marginHorizontal: 15, marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
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
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 10,
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
