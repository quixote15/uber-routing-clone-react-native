/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import {PermissionsAndroid} from 'react-native';
import Geocoder from 'react-native-geocoding';
const MAPS_API_KEY = 'AIzaSyA6sJPwAhHJGBEi9DjcLwmpIwsh1_hCFxk';
const {height, width} = Dimensions.get('window');

const App: () => React$Node = () => {
  const [latitude, setLatitude] = useState(-10.9141);
  const [longitude, setLongitude] = useState(-37.6693);
  const [mapView, setMapView] = useState(null);
  const [origin, setOrigin] = useState({ latitude: 42.3616132, longitude: -71.0672576 })
  const [destination, setDestination] = useState({ latitude: 42.3730591, longitude: -71.033754 })
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');

  const handleButton = () => {
    if (originText !== ''){
      Geocoder.init(MAPS_API_KEY);

      Geocoder.from(originText)
        .then(json => {
          const location = json.results[0].geometry.location;
          console.log(location);
          setOrigin({latitude: location.lat, longitude: location.lng});
        })
        .catch(error => console.warn(error));
    } else {
      alert('Digite a origem');
    }

    if (destinationText != '') {

      Geocoder.init(MAPS_API_KEY); // use a valid API key

      Geocoder.from(destinationText)
      .then(json => {
          var location = json.results[0].geometry.location;
          console.log(location);
          setDestination( { latitude: location.lat, longitude: location.lng } );

      })
      .catch(error => console.warn(error));
  }

  else {
      alert('Digite o destino ! ')
  }

  }


  const requesLocationPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Permissão de localização do APP',
          'message': 'O aplicativo Airbnb clone precisa acessar seu mapa para que voce possa navegar.',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED){
        console.log('voce pode usar a navegacao');
        return true;
      } else {
        console.log('permissao negada.');
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let newOrigin = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setOrigin(newOrigin);

    }, (err) => {
      console.log('errpr');
      console.log(err);

    }, {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000});
  }

  const handleGetGoogleMapDirections = () => {
    const data = {
      source: origin,
      destination,
      params: [
        {
          key: 'travelmode',
          value: 'driving',
        },
      ],
    };

    getDirections();
  }

  useEffect(async ()=>{
    let isGranted = false;
    const checkPermission = async () => {
     isGranted = await requesLocationPermission();
     if (isGranted) {
       getLocation();
      }

      getLocation();
    };
    checkPermission();
  },[]);


  return (
    <View style={styles.container}>
      <MapView
        ref={map => setMapView(map)}
        region={{
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta: Math.abs(origin.latitude - destination.latitude) + Math.abs(origin.latitude - destination.latitude) * 0.1,
          longitudeDelta: Math.abs(origin.longitude - destination.longitude)  + Math.abs(origin.longitude - destination.longitude) * 0.1,

        }}
        style={styles.MapView}
        loadingEnabled={true}
        toolbarEnabled={true}
        zoomControlEnabled={true}
         >

           <MapView.Marker coordinate={destination}>
            <MapView.Callout onPress={handleGetGoogleMapDirections}>
              <Text>Pressione para pegar a direcao</Text>
            </MapView.Callout>
           </MapView.Marker>

           <MapView.Marker coordinate={origin}>
             <MapView.Callout>

             <Text>Voce está aqui</Text>
             </MapView.Callout>
           </MapView.Marker>

           <MapViewDirections
           origin={origin}
           destination={destination}
           apikey={MAPS_API_KEY}
           strokeWidth={5}
           strokeColor="black" />
         </MapView>

         <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            onChangeText={(text) => {setOriginText(text)}}
            place="Origem"
            value={originText} />

            <TextInput
            style={styles.input}
            onChangeText={(text) => {setDestinationText(text)}}
            place="Destino"

            value={destinationText} />

          <TouchableOpacity style={styles.button} onPress={handleButton}>
            <Text style={styles.buttonText}>Calcular rota</Text>
          </TouchableOpacity>
         </View>

    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'red',
  },
  inputContainer: {
    width: '100%',
    maxHeight: 200,
  },
  buttonText: {

    color: '#000',
    fontWeight: 'bold',

  },

  input: {
    width: width - 40,
    maxHeight: 200,
    backgroundColor: '#FFF',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  MapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  button: {

    width: width - 100,
    height: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 7,
    marginBottom: 15,
    marginHorizontal: 20,

  },
});

export default App;
