import React, {useState, useEffect} from 'react';

//import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

//import Autocomplete component
import Autocomplete from 'react-native-autocomplete-input';
import {getUsers} from '../../../api/IdentityAPI'
const FactoryPickupScreen = props => {
    const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]);
  const [selectedValue, setSelectedValue] = useState({});
   useEffect(() => {
    getUsers({maxResultCount:20,skipCount:0})
    .then(({ items, totalCount: total }) => {
       // console.log('Danh sach usser===========',items)
        setFilms(items)
      /*   setTotalCount(total);
        setRecords(skip ? [...records, ...items] : items);
        setSkipCount(skip); */
      })
   /*  .then(({item,totalCount}) => {
        console.log('Danh sach usser===========',item)
        setFilms(item)
    }) */
    //   .then((json) => {
    //     const {results: films} = x``;
    //     setFilms(films);
    //     //setting the data in the films state
    //   })
      .catch((e) => {
        alert(e);
      });
  }, []); 
console.log('danh sach film',filteredFilms)
  const findFilm = (query) => {
    //method called everytime when we change the value of the input
    if (query) {
      //making a case insensitive regular expression to get similar value from the film json
      const regex = new RegExp(`${query.trim()}`, 'i');
      //setting the filtered film array according the query from the input
      setFilteredFilms(films.filter((film) => film.userName.search(regex) >= 0));
    } else {
      //if the query is null then return blank
      setFilteredFilms([]);
    }
  };
    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.autocompleteContainer}
            //data to show in suggestion
            data={filteredFilms}
            //default value if you want to set something in input
            defaultValue={
              JSON.stringify(selectedValue) === '{}' ? '' : selectedValue.userName
            }
            /*onchange of the text changing the state of the query which will trigger
            the findFilm method to show the suggestions*/
            onChangeText={(text) => findFilm(text)}
            placeholder="Enter the film title"
            flatListProps={{
              keyExtractor: (_, idx) => idx,
              renderItem: ({ item }) => <TouchableOpacity
              onPress={() => {
                setSelectedValue(item);
                setFilteredFilms([]);
              }}>
             <Text style={styles.itemText}>{item.name}/{item.email}</Text>
            </TouchableOpacity>
            }}
          />
          <View style={styles.descriptionContainer}>
            {films.length > 0 ? (
              <>
                <Text style={styles.infoText}>Selected Data</Text>
                <Text style={styles.infoText}>
                  {JSON.stringify(selectedValue)}
                </Text>
              </>
            ) : (
              <Text style={styles.infoText}>Enter The Film Title</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    ) 
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        padding: 16,
        marginTop: 40,
      },
      autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
      },
      descriptionContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      itemText: {
        fontSize: 35,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
      },
      infoText: {
        textAlign: 'center',
        fontSize: 16,
      },
})

export default FactoryPickupScreen;