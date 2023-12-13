import TrackPlayer, {RepeatMode} from 'react-native-track-player';

class AudioService {
  static instance = null;

  static getInstance() {
    if (AudioService.instance == null) {
      AudioService.instance = new AudioService();
    }

    return this.instance;
  }

  constructor() {
    this.initPlayer();
  }

  initPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  };

  addTrack = async tracks => {
    await TrackPlayer.add(tracks);
  };

  play = async () => {
    console.log('play called', await TrackPlayer.getActiveTrack());
    await TrackPlayer.play();
  };

  pause = async () => {
    await TrackPlayer.pause();
  };

  skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };

  skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  clearPlaylist = async () => {
    await TrackPlayer.reset();
  };
  shuffle = async () => {
    return null;
    const currentTrackId = await TrackPlayer.getCurrentTrack();
    let queue = await TrackPlayer.getQueue();

    // Remove current track from queue
    queue = queue.filter(track => track.id !== currentTrackId);

    // Shuffle remaining tracks
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    // Add current track back to the start of the queue
    queue.unshift({id: currentTrackId});

    // Reset the queue in the player
    await TrackPlayer.reset();
    await TrackPlayer.add(queue);

    // Start playing the current track
    await TrackPlayer.play();
  };
}

const audioServiceIns = AudioService.getInstance();
export default audioServiceIns;
