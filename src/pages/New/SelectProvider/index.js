import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Container, ProvidersList, Provider, Avatar, Name} from './styles';

import Background from '~/components/Background';
import api from '~/services/api';

export default function SelectProvider({navigation}) {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('providers');

      setProviders(response.data);
    }

    loadProviders();
  }, []);

  function handleAvatarURL(data) {
    if (__DEV__ && data.avatar) {
      let pathAvatar = data.avatar.url;

      pathAvatar = pathAvatar.replace('localhost', '192.168.0.103');

      return pathAvatar;
    }
    if (data.avatar) return data.avatar.url;
    return `https://api.adorable.io/avatar/50/${data.name}.png`;
  }

  return (
    <Background>
      <Container>
        <ProvidersList
          data={providers}
          keyExtractor={provider => String(provider.id)}
          renderItem={({item}) => (
            <Provider
              onPress={() => navigation.navigate('SelectDateTime', {item})}>
              <Avatar source={{uri: handleAvatarURL(item)}} />
              <Name>{item.name}</Name>
            </Provider>
          )}
        />
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({navigation}) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}>
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
