import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class Search extends React.Component{
    render(){
      return (
        <View style={{flex: 1, backgroundColor: '#f1a9a0',justifyContent:'center',alignItems:'center'}}>
          <Text>Search</Text>
        </View>
      )
    }
  }