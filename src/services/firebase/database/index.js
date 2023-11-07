import {firebase} from '@react-native-firebase/database';
import {DB_URL} from '@env';

const firebaseDatabase = firebase.app().database(DB_URL);

export default firebaseDatabase;
