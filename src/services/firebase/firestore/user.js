import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const usersRef = firestore().collection('user');

export async function logout({userId}) {
  try {
    await AsyncStorage.multiRemove(['userId', 'token', 'refreshToken']);
    await usersRef.doc(userId).delete('FCMToken');
  } catch (er) {
    console.log('Logout error', er);
  }
}

export async function registerUser({email, password, ...rest}) {
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password
  );
  const user = userCredential.user;
  console.log('user', user);
  if (user) {
    // Gửi email xác minh
    await user.sendEmailVerification();

    const userData = {
      uid: user.uid,
      email: user.email,
      weeklyPlan: {},
      plans: [],
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
    // Return user data from userCredential
    return {
      uid: user.uid,
      email: user.email,
      groupId: null,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
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
export async function updateUserInfo({
  uid,
  nickname,
  gender,
  dateOfBirth,
  email,
  BMI
}) {
  const user = auth().currentUser;
  if (user) {
    await user.updateProfile({
      displayName: nickname,
      email: email
    });

    const userData = {
      nickname: nickname,
      gender: gender,
      dateOfBirth: dateOfBirth,
      email: email,
      BMI: BMI
    };
    await usersRef.doc(uid).update(userData);

    return userData;
  }
}
