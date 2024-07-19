import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useAuthContext } from '../Navigations/AuthContext';
const PhoneVerification = ({ route, navigation }) => {
  const [code, setCode] = useState('');
  const { confirmCode } = useAuthContext();
  const { phone } = route.params;

  const handleConfirmCode = async () => {
    try {
      await confirmCode(code);
      Alert.alert('Success', 'Phone number verified successfully');
      navigation.navigate('Home'); // Replace 'Home' with your main screen
    } catch (error) {
      Alert.alert('Error', 'Invalid code');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter the code sent to {phone}</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={code}
        onChangeText={setCode}
        placeholder='Verification code'
      />
      <Button title='Confirm Code' onPress={handleConfirmCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default PhoneVerification;
