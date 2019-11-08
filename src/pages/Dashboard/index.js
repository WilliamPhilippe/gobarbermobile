import React, {useEffect, useState} from 'react';
import {withNavigationFocus} from 'react-navigation';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import {Container, Title, List} from './styles';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';

function Dashboard({isFocused}) {
  const [appointents, setAppointments] = useState([]);

  async function loadAppointments() {
    const response = await api.get('appointments');

    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  function handleAvatarURL(data) {
    if (__DEV__) {
      let pathAvatar = data.provider.avatar.url;

      pathAvatar = pathAvatar.replace('localhost', '192.168.0.103');

      return pathAvatar;
    }
    if (data.provider.avatar) return data.provider.avatar.url;
    return `https://api.adorable.io/avatar/50/${data.provider.name}.png`;
  }

  async function handleCancell(id) {
    const response = await api.delete(`appointments/${id}`);

    setAppointments(
      appointents.map(ap =>
        ap.id === id ? {...ap, cancelled_at: response.data.cancelled_at} : ap
      )
    );
  }

  return (
    <Background>
      <Container>
        <Title>Agendamentos</Title>

        <List
          data={appointents}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <Appointment
              data={item}
              onCancell={() => handleCancell(item.id)}
              avatarURL={handleAvatarURL(item)}
            />
          )}
        />
      </Container>
    </Background>
  );
}

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: ({tintColor}) => (
    <Icon name="event" size={20} color={tintColor} />
  ),
};

export default withNavigationFocus(Dashboard);
