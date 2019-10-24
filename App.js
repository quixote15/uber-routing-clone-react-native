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
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MapView from 'react-native-maps';

const {height, width} = Dimensions.get('window');

const App: () => React$Node = () => {
  // const [latitude, setLatitude] = useState(-10.9141);
  //  const [longitude, setLongitude] = useState(-37.6693);
  const [mapView, setMapView] = useState(null);
  const [places, setPlaces] = useState([
    {
      id: 1,
      title: 'Casa do café',
      description: 'Café quentinho...',
      latitude: -27.210671,
      longitude: -49.63627,
    },
    {
      id: 2,
      title: 'RocketSeat',
      description: 'Programação, empreendedorismo e mindset',
      latitude: -27.200671,
      longitude: -49.63627,
    },
    {
      id: 3,
      title: 'Casa do José',
      description: 'José, tá em casa?',
      latitude: -27.200671,
      longitude: -49.62627,
    },
    ,
  ]);

  useEffect(() => {
    /*setTimeout(() => {
      if (mapView) {
        console.log(mapView.getCamera());
        mapView.animateToCoordinate(
          {
            latitude: -10.6141,
            longitude: -37.2693,
          },
          2000,
        );
      }
    }, 3000);*/
  }, [mapView]);

  const _mapReady = () => {
    places[0].mark.showCallout();
  }

  const {latitude, longitude} = places[0];
  return (
    <View style={styles.container}>
      <MapView
        ref={map => setMapView(map)}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0142,
          longitudeDelta: 0.0231,
        }}
        style={styles.MapView}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        onMapReady={_mapReady}>
        {places.map(place => (
          <MapView.Marker
            ref={mark => {place.mark = mark}}
            key={place.id}
            title={place.title}
            description={place.description}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
          />
        ))}
      </MapView>

      <ScrollView
        style={styles.placesContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={e => {
          const scrolled = e.nativeEvent.contentOffset.x;

          const place = (scrolled > 0) ? Math.ceil(scrolled / Dimensions.get('window').width) : 0;
          console.log('width',  Dimensions.get('window').width);
          console.log(scrolled);
          console.log(place);
          const {latitude, longitude, mark} = places[place];
          mapView.animateToCoordinate({
            latitude,
            longitude,
          }, 1000);

          setTimeout(() => {
            mark.showCallout();
          }, 1000);
        }}
        >
        {places.map(place => (
          <View style={styles.place} key={place.id}>
            <Text>{place.title}</Text>
            <Text>{place.description}</Text>
          </View>
        ))}
      </ScrollView>
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
  placesContainer: {
    width: '100%',
    maxHeight: 200,
  },
  place: {
    width: width - 40,
    maxHeight: 200,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  MapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default App;
