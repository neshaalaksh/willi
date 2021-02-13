import * as React from 'react';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as firebase from 'firebase'
import db from '../config'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default class Transaction extends React.Component{
  constructor(){
    super()
    this.state={
      hasCameraPermissions:null,
      scanned:false,
      scannedBookId:'',
      scannedStudentId:'',
      buttonState:'normal',
      transactionMessage:'',
    }
  }

  getCameraPermission=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonState:id,
      scanned:false
    })
  }
  handleBarcodeScan=async({type,data})=>{
    const {buttonState}=this.state
    if (buttonState=='bookid'){
      this.setState({
        scanned:true,
        scannedBookId:data,
        buttonState:'normal'
      })
    }else if (buttonState=='studentid'){
      this.setState({
      scanned:true,
      scannedStudentId:data,
      buttonState:'normal'
      }
    )}
  }
  handleTransaction=()=>{
    var transactionMessage;
    db.collection('Books').doc(this.state.scannedBookId).get()
    .then(doc=>{
      console.log(doc.data())
      var book=doc.data()
      if (book.bookAvailability){
        this.initiateBookIssue()
        transactionMessage='bookIssued'
      }else{
        this.initiateBookReturn()
        transactionMessage='bookReturned'
      }
    })
    this.setState({
      transactionMessage:transactionMessage
    })
  }
  initiateBookIssue=async()=>{
    db.collection('transaction').add({
      'studentId':this.state.scannedStudentId,
      'bookId':this.state.bookId,
      'data':firebase.firestore.Timestamp.now().toDate(),
      'transcationType':'Issue'
    })
    db.collection('Books').doc(this.state.scannedBookId).update({
      'bookAvailability':false,
    })
    db.collection('Students').doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
    })
    this.setState({
      scannedStudentId:'',
      scannedBookId:'',
    })
  }
  initiateBookReturn=async()=>{
    db.collection('transaction').add({
      'studentId':this.state.scannedStudentId,
      'bookId':this.state.bookId,
      'data':firebase.firestore.Timestamp.now().toDate(),
      'transcationType':'Return'
    })
    db.collection('Books').doc(this.state.scannedBookId).update({
      'bookAvailability':true,
    })
    db.collection('Students').doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scannedStudentId:'',
      scannedBookId:'',
    })
  }
    render(){
      const hasCameraPermissions=this.state.hasCameraPermissions
      const scanned=this.state.scanned
      const buttonState=this.state.buttonState
      if (buttonState!='normal' && hasCameraPermissions){
        return (
          <BarCodeScanner 
          onBarCodeScanned={scanned?undefined:this.handleBarcodeScan} 
          style={StyleSheet.absoluteFillObject}/>
        )
      }
      
      else if (buttonState=='normal'){
        return (
          <View style={{flex: 1, backgroundColor: '#fff',justifyContent:'center',alignItems:'center'}}>
            <View>
              <Image source={require('../assets_main/booklogo.jpg')} style={{width:100,height:100,marginBottom:20}}/>
            </View>
            <View style={styles.inputView}>
              <TextInput style={styles.inputBox} 
              placeholder={'bookid'} value={
                this.state.scannedBookId
              }/>
              <TouchableOpacity style={styles.button2} onPress={()=>{
                this.getCameraPermission('bookid')
              }}><Text style={styles.text}>Scan</Text></TouchableOpacity>
            </View>
            <View style={styles.inputView}>
              <TextInput style={styles.inputBox} 
              placeholder={'studentid'} value={
                this.state.scannedStudentId
              }/>
              <TouchableOpacity style={styles.button2} onPress={()=>{
                this.getCameraPermission('studentid')
              }}><Text style={styles.text}>Scan</Text></TouchableOpacity>
            </View>
            <Text style={styles.text1}>{hasCameraPermissions==true?this.state.scannedData:'Request camera permission'}</Text>
            <TouchableOpacity style={styles.button} onPress={()=>{this.handleTransaction()}}><Text style={styles.text}>Submit</Text></TouchableOpacity>
          </View>
        )
      }
    }
  }

const styles=StyleSheet.create({
  button: {
    width: '90%',
    height: 55,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#96281b',
    borderRadius: 10,
    marginTop:20,
    // marginRight:210
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color:'white'
  },
  text1: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color:'#96281b',
    marginTop:30,
  },
  inputView:{
    flexDirection:'row',
    margin:20
  },
  inputBox:{
    width:200,
    height:50,
    borderWidth:2,
    borderColor:'black',
    marginTop:13,
    borderRadius:10,
    // alignItems:'center',
    // alignContent:'center',
    textAlign: 'center'
,  },
  button2:{
    width: '40%',
    height: 55,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
    backgroundColor: '#96281b',
    borderRadius: 10,
  }
})