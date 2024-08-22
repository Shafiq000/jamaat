import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';

const Test = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    try {
      const uri = 'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken';
      const result = await fetch(uri);
      const data = await result.json();
        console.log("data",JSON.stringify(data,null,2));
      if (data) {
        setData(data);
      } else {
        setError('No data found');
      }

    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{justifyContent: 'center', padding: 10 }}>
        <Text>{item.strInstructions}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0a9484" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'gray' }}>
      {
        data? <View> 
            <Text>{data.strMeal}</Text>
             </View> :null
      }
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
