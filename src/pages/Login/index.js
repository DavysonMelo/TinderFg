import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TextInput, TouchableOpacity, Text, AsyncStorage, Alert } from 'react-native';

import api from '../../services/api';

import LoadingModal from '../../components/LoadingModal';
import logo from '../../assets/logo.png';

import styles from './styles';

function Login({ navigation }){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [border, setBorderColor] = useState("#fff");

    const [modalVisible, setModalVisibility] = useState(false);

    useEffect(() => {
        async function handleAuthorizedUser(){
            try{
                const item = await AsyncStorage.getItem('user');

                if(item) {
                    navigation.navigate('Main', item );
                }
            }catch(error){
                console.log('Erro async storage', error);
            }
        }
        handleAuthorizedUser();
    }, []);

    async function handleLogin() {

        try{
            if(email === '' && password === ''){
                setModalVisibility(false);
                setBorderColor('#c20a0a');
                Alert.alert(
                    'Ei pow!', 
                    'Os campos não podem ficar vazios.',
                    [
                        {text: 'Ah, beleza'}
                    ]
                    );

            }else{
                setModalVisibility(true);
                const response = await api.post('/login', {email, password});
                
                const user = response.data;

                const item = JSON.stringify(response.data);

                if(user){
                    
                    await AsyncStorage.setItem('user', item);

                    navigation.navigate('Main', item);

                    setEmail('');
                    setPassword('');
                    setBorderColor('#FFF');
                    setModalVisibility(false);
                }else{
                    setModalVisibility(false);
                    setBorderColor('#c20a0a');
                    Alert.alert('Poxa :(', 'Esse usuário não foi encontrado, verifica teu email e senha.');
                }
            }

        }catch(error){
            setModalVisibility(false);
            setBorderColor('#c20a0a');
            Alert.alert('Poxa :(', 'Esse usuário não foi encontrado, verifica teu email e senha.');
            console.log('Login error', error);
        }
    }

    function handleSignUp() {
        navigation.navigate('Register');
    }

    return (
        <View style={styles.container} behavior='padding' enabled>
            <LoadingModal visible={modalVisible}/>
            <Image style={styles.logo} source={logo}/>
            <TextInput 
                style={{ ...styles.emailInput, borderColor: border }}
                autoCapitalize='none'
                placeholder='Digite seu e-mail'
                textContentType='emailAddress'
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={{ ...styles.passwordInput, borderColor: border }}
                textContentType='password'
                secureTextEntry={true}
                autoCapitalize='none'
                placeholder='Digite sua senha'
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUp} style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Cadastre-se</Text>
            </TouchableOpacity>
            
        </View>
    )
}

export default Login;