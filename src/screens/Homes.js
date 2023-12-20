import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
export default function HomeScreen({navigation}) {

  const [activeCategory, setActiveCategory] = useState('Beef');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [slug, setSlug] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [chat, setChat] = useState('');

  const onPresss = (e) => {
  const tanggal = new Date().getDate();
  const bulan = new Date().getMonth();
  const tahun = new Date().getFullYear();

  // Menggunakan regular expression untuk menyensor kata tertentu
  const sensitiveWords = ['dog', 'pig', 'fuck', 'rough','bitch','fucking','bastard','damn','bloody','moron'];
  const censoredChat = chat.replace(new RegExp(sensitiveWords.join('|'), 'gi'), '***SENSORED***');

  var datas = {
    'nama': username,
    'emails': email,
    'message': censoredChat,
    'date': `${tahun}-${bulan}-${tanggal}`,
  };


  // if ( messages.length == 0 ) {
  // setMessages(datas);
  // } else {
    setMessages(old => [...old, datas]);

  // }

  setUsername('');
  setEmail('');
  setChat('');
  console.log(messages);

}

  useLayoutEffect(()=>{
    getCategories();
    getRecipes();
  },[])

  useEffect(() => {
  	if( slug !== null ) {
  		navigation.navigate("Home", {slugs : slug});
  	}

  }, [navigation, slug]);



  const handleChangeCategory = category=>{
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  }

  const getCategories = async ()=>{
    try{
      const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
      // console.log('got categories: ',response.data);
      if(response && response.data){
        
        const data = response.data.categories.filter(function (category) {
          return category.strCategory !== 'Pork' && category.strCategory !== 'Vegan';
        })


        setCategories(data);
      }
    }catch(err){
      console.log('error: ',err.message);
    }
  }
  const getRecipes = async (category="Beef")=>{
    try{
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      // console.log('got recipes: ',response.data);
      if(response && response.data){
        setMeals(response.data.meals);
      }
    }catch(err){
      console.log('error: ',err.message);
    }
  }
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        className="space-y-6 pt-14"
      >
        {/* avatar and bell icon */}
        

        {/* greetings and punchline */}
        <View className="mx-4 space-y-2 mb-2">
          <View>
            <Text style={{fontSize: hp(3.8)}} className="font-semibold text-neutral-600">Make your own food,</Text>
          </View>
          <Text style={{fontSize: hp(3.8)}} className="font-semibold text-neutral-600">
            stay at <Text className="text-amber-400">home</Text>
          </Text>
        </View>

        <View className="mx-4 space-y-2 mb-2">
        	<TouchableOpacity onPress={() => setSlug('1')}>
        
        	<Text style={{fontSize: hp(3.0), borderBottomWidth: 1, paddingBottom: 4, marginBottom: 20}} className="font-semibold text-neutral-600">
            Food and Beverage
          </Text>

          </TouchableOpacity>

        <TouchableOpacity onPress={() => setSlug('2')}>

          <Text style={{fontSize: hp(3.0), borderBottomWidth: 1, paddingBottom: 4, marginBottom: 20}} className="font-semibold text-neutral-600">
            Dessert
          </Text>
        
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSlug('3')}>

          <Text style={{fontSize: hp(3.0), borderBottomWidth: 1, paddingBottom: 4}} className="font-semibold text-neutral-600">
            Vegan
          </Text>

          </TouchableOpacity>

        </View>

                   <View style={{marginBottom: 20, borderBottomWidth: 4,}}></View>

    <View style={{height: '7%',}} className="mx-4 relative z-50">
                <View 
                  className="flex-row justify-end items-center" 
                  style={{borderBottomWidth: 2, borderColor: 'blue'}}>
                    <TextInput 
                          value={username}
                          placeholder="Username" 
                          placeholderTextColor={'black'} 
                          onChangeText={e => setUsername(e)}
                          className="pl-6 h-10 pb-1 flex-1 text-base text-dark" 
                        />                  
                </View>
              </View>

    <View style={{height: '7%',}} className="mx-4 relative z-50">
                <View 
                  className="flex-row justify-end items-center" 
                  style={{borderBottomWidth: 2, borderColor: 'blue'}}>
                    <TextInput 
                          value={email}                        
                          placeholder="Email" 
                          onChangeText={e => setEmail(e)}
                          placeholderTextColor={'black'} 
                          className="pl-6 h-10 pb-1 flex-1 text-base text-dark" 
                        />                  
                </View>
              </View>

    <View style={{height: '7%',}} className="mx-4 relative z-50">
                <View 
                  className="flex-row justify-end items-center" 
                  style={{borderBottomWidth: 2, borderColor: 'blue'}}>
                    <TextInput 
                          onChangeText={message => setChat(message)} 
                          placeholder="Comentar" 
                          value={chat}
                          placeholderTextColor={'black'} 
                          className="pl-6 h-10 pb-1 flex-1 text-base text-dark" 
                        />                  
                </View>
              </View>
              <View style={{height: '7%',}} className="mx-4 relative z-50" 
  style={{marginBottom: 100}}

              >
                    <Button
  onPress={onPresss}
  title="Tambah Pesan"
  color="#841584"
  className="pl-6 h-10 pb-1 flex-1 text-base text-dark"
  accessibilityLabel="Learn more about this purple button"
/>                  
                </View>

                <View style={{borderBottomWidth: 4,}}></View>


            {messages.map((data,i) => (
               <View 
                          className="flex justify-center p-4 rounded-3xl py-3 space-y-1 mr-4" 
                          style={{}} key={i}
                        >
                          <Text className="text-dark" style={{fontWeight: 'bold', fontSize: 20}}>{data.nama}</Text>
                          <Text className="text-dark" style={{fontSize: 10, marginBottom: 10}}>
                            {data.date}
                          </Text>
                          <Text className="text-dark" style={{fontSize: 15}}>
                            {data.message}
                          </Text>
                <View style={{marginBottom: 30, borderBottomWidth: 4, borderColor: 'green', borderRadius: 100}}></View>

                </View>

          ))}

                <View style={{marginTop:900,}}></View>

        {/* search bar */}

        {/* categories */}

      </ScrollView>
    </View>
  )
}