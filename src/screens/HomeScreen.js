import { View, Text, ScrollView, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
export default function HomeScreen({route}) {

  const [activeCategory, setActiveCategory] = useState('Beef');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const { slugs } = route.params;


  useEffect(()=>{
    getCategories();
    getRecipes();
    console.log(slugs);

  },[])

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
          return category.strCategory !== 'Pork';
        })
        
        function filterCategories(categories, filterKeywords) {
          return categories.filter(category => filterKeywords.includes(category.strCategory));
        }

        if ( slugs == '1' ) {
          const filteredCategories = filterCategories(data, ["Beef", "Chicken", "Side", 'Seafood', 'Pasta', 'Miscellaneous', 'Lamb']);
          setCategories(filteredCategories);

        } else if ( slugs == '2' ) {
          const filteredCategories = filterCategories(data, ['Dessert', 'Starter']);
          setCategories(filteredCategories);
        } else if ( slugs == '3' ) {
          const filteredCategories = filterCategories(data, ['Vegan', 'Vegetarian']);
          setCategories(filteredCategories);
        }

        // Memfilter kategori "Goat" dan "Breakfast"  



       




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

        {/* search bar */}

        {/* categories */}
        <View>
          { categories.length>0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} /> }
        </View>

        {/* recipes */}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>
  )
}