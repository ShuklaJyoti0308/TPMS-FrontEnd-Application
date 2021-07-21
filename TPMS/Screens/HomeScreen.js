import React from 'react'
import {View, Text} from 'react-native'
import Carousel from '../components/Carousel'
import { dummyData } from '../data/Data'


const HomeScreen = ({navigation}) =>{
    return (
        <View>
            <Carousel data = {dummyData}/>
        </View>
    )
}

export default HomeScreen