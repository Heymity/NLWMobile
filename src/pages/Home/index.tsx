import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

interface UF {
  sigla: string
}

interface City {
  nome: string
}

const Home = () => {
  const navigation = useNavigation();

  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City>();
  const [ufs, setUfs] = useState<UF[]>([])
  const [selectedUF, setSelectedUF] = useState<UF>();

  useEffect(() => { 
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
      setUfs(response.data)
      console.log("data:",  response.data)
    })
  }, [])

  useEffect(() => { 
    if(selectedUF === undefined) return;
    console.log("sigla", selectedUF.sigla);
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF.sigla}/municipios`).then(response => {
      setCities(response.data);
    })
  }, [selectedUF])

  function handleNavigationToPoint() {
    navigation.navigate('Points', { 
      uf: selectedUF?.sigla,
      city: selectedCity?.nome
     });
  }

  return (
    <ImageBackground 
      source={require('./../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ height: 368, width: 274 }}
    >
      <View style={styles.main}>
       <Image source={require('../../assets/logo.png')} />
       <Text style={styles.title} >Seu marketplace de coleta de residuos</Text>
       <Text style={styles.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedUF(value)}
          items={ufs.map(uf => (
            { label: uf.sigla, value: uf }
          ))}
        />
        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          items={cities.map(city => {
            console.log(city)
            return ({ label: city.nome, value: city })
          })}
        />
        <RectButton style={styles.button} onPress={handleNavigationToPoint} >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24}/>
            </Text> 
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>

    </ImageBackground>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});
