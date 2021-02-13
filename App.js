import React from 'react';
import { StyleSheet, Image} from 'react-native';
import TransactionScreen from './Screens/TransactionScreen'
import SearchScreen from './Screens/SearchScreen'
import { createAppContainer } from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'
export default class App extends React.Component{
  render(){
    return (
      <AppContainer/>
    )
  }
}
const tabNavigator=createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen},
},
  {
    defaultNavigationOptions:({navigation})=>({
      tabBarIcon:()=>{
        const routeName=navigation.state.routeName
        if (routeName=='Transaction'){
          return(
          <Image source={require('./assets_main/book.png')} style={{width:30, height:30}}/>
          )
        }
        else if (routeName=='Search'){
          return(
          <Image source={require('./assets_main/searchingbook.png')} style={{width:30, height:30}}/>
          )
      }
    }
    
    })
  })


const AppContainer = createAppContainer(tabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
