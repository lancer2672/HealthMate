import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {clearPlaylists} from 'src/features/exercise/components/playlist/data/playlistService';
const usersRef = firestore().collection('user');

export async function logout({userId}) {
  try {
    await auth().signOut();
    await AsyncStorage.multiRemove(['userId', 'token', 'refreshToken']);
    await clearPlaylists();
    await usersRef.doc(userId).delete('FCMToken');

    console.log('User logged out', userId);
  } catch (er) {
    console.log('Logout error', er);
  }
}

export async function registerUser({email, password, name, ...rest}) {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password
  );
  const user = userCredential.user;
  console.log('register user', user);
  if (user) {
    // Gửi email xác minh
    await user.sendEmailVerification();
    const userData = {
      uid: user.uid,
      email: user.email,
      name,
      isGetInformation: false,
      weeklyPlan: {},
      plans: [],
      exerciseHistory: [],
      ...rest
    };
    await usersRef.doc(user.uid).set(userData);

    return userData;
  }
}

export async function loginUser({email, password}) {
  const userCredential = await auth().signInWithEmailAndPassword(
    email,
    password
  );
  const user = userCredential.user;
  if (user) {
    if (!user.emailVerified) {
      throw new Error('Email not verified');
    }
    let data = await getUserData(user.uid);

    console.log('getUserData', data);
    // Return user data from userCredential
    return data;
  }
}

export async function saveToken({FCMToken, userId}) {
  try {
    // Lưu trữ FCM token vào cơ sở dữ liệu
    console.log('SAVE FCM', userId);
    await usersRef.doc(userId).update({
      FCMToken
    });
  } catch (error) {
    console.log('Save FCMToken error', error.message);
    throw error;
  }
}

export async function getUserData(userId) {
  try {
    const user = await usersRef.doc(userId).get();
    return user.data();
  } catch (error) {
    console.log('Get user error', error.message);
  }
}
export async function updateUserInfo({userId, userData}) {
  const user = auth().currentUser;
  if (user) {
    await usersRef.doc(userId).update(userData);

    return userData;
  }
}
