import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Text, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//view: a movie
const AMovie = ({ item }) => {
  return (
    <TouchableOpacity style={styles.GridViewBlockStyle}>
      <Image source={{
        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`
      }} style={styles.imgMovie} />
      <LinearGradient colors={['orange', 'red']} style={styles.ViewRate}>
        <Text style={[styles.RateNumberFirst, styles.RateNumber]}>{(item.vote_average + '').substring(0, 1)}</Text>
        <Text style={[styles.RateNumberSecond, styles.RateNumber]}>{(item.vote_average + '').substring(1, 3)}</Text>
      </LinearGradient>
      <View style={styles.ViewInfo}>
        <Text style={[styles.MovieReleaseDate, styles.MovieText]}>{item.release_date.substring(0, 4)}</Text>
        <Text style={[styles.MovieTitle, styles.MovieText]}>{item.title.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      isLoading: true
    };
  }

  //read page = 1
  async getMovies() {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=26763d7bf2e94098192e629eb975dab0&page=1`);
      const json = await response.json();
      this.setState({ data: json.results });
      this.setState({ page: 1 });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  //read page > 1
  async getNextMovies() {
    try {
      this.state.page++;
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=26763d7bf2e94098192e629eb975dab0&page=${this.state.page}`);
      const json = await response.json();
      this.setState({ data: [...this.state.data, ...json.results] });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.getMovies();
  }

  render() {
    const { data, page, isLoading } = this.state;
    const fetchNewPage = () => { this.getNextMovies() }
    return (
      <View style={styles.MainContainer}>
        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            ListHeaderComponent={<Text style={styles.ListHeader} > Popular list</Text>}
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => <AMovie item={item} />}
            numColumns={2} //2 columns
            onEndReached={() => { fetchNewPage() }} // load more
            onEndReachedThreshold={0.6}
            refreshControl={ //refesh
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => {
                  this.getMovies()
                }}
              />}
          />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
  //text: Popular list
  ListHeader: {
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'sans-serif-light'
  },
  //view: a movie in list movie
  GridViewBlockStyle: {
    justifyContent: 'flex-end',
    flex: 1 / 2,
    height: 300,
    margin: 10,
    borderRadius: 8,
    elevation: 5,
  },
  //image: movie poster
  imgMovie: {
    position: 'absolute',
    borderRadius: 8,
    width: '100%',
    height: '100%'
  },
  //view: circle rate
  ViewRate: {
    flexDirection: 'row',
    position: 'absolute',
    borderRadius: 20,
    width: 40,
    height: 40,
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange'
  },
  RateNumber: {
    width: '50%',
    color: 'white',
    fontFamily: 'sans-serif-light'
  },
  RateNumberFirst: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 22
  },
  RateNumberSecond: {
    fontSize: 15
  },
  //view: movie name and year
  ViewInfo: {
    padding: 10,
  },
  //text: movie name and year
  MovieText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
    fontFamily: 'sans-serif-light'
  },
  //text: movie name
  MovieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  //text: year
  MovieReleaseDate: {
    fontSize: 15,
  },
});