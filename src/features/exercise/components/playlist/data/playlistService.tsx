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
