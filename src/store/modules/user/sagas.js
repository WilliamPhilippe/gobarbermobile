import {Alert} from 'react-native';
import {all, takeLatest, call, put} from 'redux-saga/effects';
import api from '~/services/api';

import {updateProfileSuccess, updateProfileFailure} from './actions';

export function* profileUpdate({payload}) {
  try {
    const {name, email, ...rest} = payload.data;

    const profile = {
      name,
      email,
      ...(rest.oldPassword ? rest : {}),
    };

    const response = yield call(api.put, 'users', profile);

    Alert.alert('Tudo certo.', 'Seu perfil foi atualizado.');

    yield put(updateProfileSuccess(response.data));
  } catch (err) {
    Alert.alert('Algum dado está errado.', 'Seu perfil não foi atualizado.');

    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', profileUpdate)]);
