import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAYLIST_KEY = '@playlists';
export const getPlaylists = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PLAYLIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log('er', e);
    return [];
  }
};

export const clearPlaylists = async () => {
  try {
    await AsyncStorage.removeItem(PLAYLIST_KEY);
    console.log('clear playlist success');
  } catch (e) {
    console.log('er', e);
    return [];
  }
};

export const addSong = async ({playlistName, songs}) => {
  try {
    const playlists = await getPlaylists();
    const playlistIndex = playlists.findIndex(
      playlist => playlist.name === playlistName
    );
    if (playlistIndex !== -1) {
      playlists[playlistIndex].songs = [
        ...playlists[playlistIndex].songs,
        ...songs
      ];
      const jsonValue = JSON.stringify(playlists);
      await AsyncStorage.setItem(PLAYLIST_KEY, jsonValue);
    }
    return playlists;
  } catch (e) {
    console.log('er', e);
  }
};

export const removeSong = async ({playlistName, song}) => {
  try {
    const playlists = await getPlaylists();
    const playlistIndex = playlists.findIndex(
      playlist => playlist.name === playlistName
    );
    if (playlistIndex !== -1) {
      const songIndex = playlists[playlistIndex].songs.findIndex(
        s => s.title === song.title
      );
      if (songIndex !== -1) {
        playlists[playlistIndex].songs.splice(songIndex, 1);
        const jsonValue = JSON.stringify(playlists);
        await AsyncStorage.setItem(PLAYLIST_KEY, jsonValue);
      }
    }
    return playlists;
  } catch (e) {
    console.log('er', e);
  }
};

export const addPlaylist = async playlistName => {
  try {
    const playlists = await getPlaylists();
    const playlistIndex = playlists.findIndex(
      playlist => playlist.name === playlistName
    );
    if (playlistIndex === -1) {
      playlists.push({name: playlistName, songs: []});
      const jsonValue = JSON.stringify(playlists);
      await AsyncStorage.setItem(PLAYLIST_KEY, jsonValue);
    }
    return playlists;
  } catch (e) {
    console.log('er', e);
  }
};

export const removePlaylist = async playlistName => {
  try {
    let playlists = await getPlaylists();
    playlists = playlists.filter(playlist => playlist.name !== playlistName);
    const jsonValue = JSON.stringify(playlists);
    await AsyncStorage.setItem(PLAYLIST_KEY, jsonValue);
    return playlists;
  } catch (e) {
    console.log('er', e);
  }
};

// import SQLite from 'react-native-sqlite-storage';

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

// const database_name = "Playlists.db";
// const database_version = "1.0";
// const database_displayname = "SQLite Playlists Database";
// const database_size = 200000;

// let db;

// export async function initDB() {
//   try {
//     db = await SQLite.openDatabase(
//       database_name,
//       database_version,
//       database_displayname,
//       database_size
//     );
//     await db.executeSql('CREATE TABLE IF NOT EXISTS Playlists (name, songs)');
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getPlaylists() {
//   try {
//     await initDB();
//     const results = await db.executeSql('SELECT * FROM Playlists');
//     let rows = results[0].rows;
//     let playlists = [];
//     for (let i = 0; i < rows.length; i++) {
//       let item = rows.item(i);
//       playlists.push({
//         name: item.name,
//         songs: JSON.parse(item.songs)
//       });
//     }
//     return playlists;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// }

// export async function addPlaylist(playlistName) {
//   try {
//     await initDB();
//     await db.executeSql('INSERT INTO Playlists (name, songs) VALUES (?, ?)', [playlistName, JSON.stringify([])]);
//     return getPlaylists();
//   } catch (error) {
//     console.log(error);
//   }
// }
