import { initializeApp, getApps } from 'firebase/app';
import { getDatabase }            from 'firebase/database';

const firebaseConfig = {
  apiKey:            'AIzaSyCkcvOXcbwEP-_CNeCxcCHfPl_KkKU2wQA',
  authDomain:        'investigacion2-dps.firebaseapp.com',
  databaseURL:       'https://investigacion2-dps-default-rtdb.firebaseio.com',
  projectId:         'investigacion2-dps',
  storageBucket:     'investigacion2-dps.firebasestorage.app',
  messagingSenderId: '365507755977',
  appId:             '1:365507755977:web:6550eb274f38b3b566b218',
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const db = getDatabase(app);
export default app;