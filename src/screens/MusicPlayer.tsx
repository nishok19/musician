import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {playListData} from '../constants';
import SongInfo from '../components/SongInfo';
import SongSlider from '../components/SongSlider';
import ControlCentral from '../components/ControlCentral';

const {width} = Dimensions.get('window');

const MusicPlayer = () => {
  const [track, setTrack] = useState<Track | null>();

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    switch (event.type) {
      case Event.PlaybackActiveTrackChanged:
        const playingTrack = await TrackPlayer.getTrack(
          // TODO : this is changed inorder get rid of the error
          event?.index ? event?.index : event?.lastPosition,
        );
        setTrack(playingTrack);
        break;

      default:
        break;
    }
  });

  const renderArtwork = () => (
    <View style={styles.listArtWrapper}>
      <View style={styles.albumContainer}>
        {track?.artwork && (
          <Image
            style={styles.albumArtImg}
            source={{uri: track?.artwork?.toString()}}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={playListData}
        renderItem={renderArtwork}
        keyExtractor={song => song.id.toString()}
      />

      <SongInfo track={track} />
      <SongSlider />
      <ControlCentral />
    </View>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#001d23',
  },
  listArtWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumContainer: {
    width: 300,
    height: 300,
  },
  albumArtImg: {
    height: '100%',
    borderRadius: 4,
  },
});
