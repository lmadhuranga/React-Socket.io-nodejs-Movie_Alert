import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
let socketUrl = process.env.NODE_ENV==='development'?'http://localhost:3001':'/';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
});

class MoviesList extends Component {
  constructor(){
    super();
    this.state = {movies: [], liveCount:0};
  }

  setup() {
    const socket = socketIOClient(socketUrl);
    socket.on('connect', () => {
      const socketId = socket.id;
      socket.on(`init-${socketId}`, (data)=>{
        console.log('init called',data);
        this.setState({ movies: data.latestMovies});
      })
      console.log('Client => Connected => Server ID=>', socket.id, socket);
      socket.on("newmovies", (data) => {;
        // this.setState({movies:[...this.state.movies,data.latestMovies]});
        this.setState({ movies: data.latestMovies });
      });
      socket.on("liveCount", (data) => {;
        this.setState({ liveCount:data.liveCount });
      });
    });
    socket.on('disconnect', () => {
      const socketId = socket.id;
      socket.removeAllListeners("newmovies");
      socket.removeAllListeners(`init-${socketId}`);
      socket.removeAllListeners(`liveCount`);
      socket.off(`ini t-${socketId}`)
      socket.off("newmovies")
      socket.off(`liveCount`)
      console.log("Socket Disconnected");
    });
  }

  componentDidMount(props, satets) {
    setTimeout(this.setup.bind(this), 1000);
  }

  
  render(props) {
    console.log('pro',props);
    // const { classes } = props;
     let movieList = this.state.movies.map((movie) =>{
       let youtubUrl = `https://www.youtube.com/watch?v=${movie.yt_trailer_code}`
      return  <ListItem key={movie.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={movie.title_long} src={movie.small_cover_image} />
                </ListItemAvatar>
                <ListItemText
                  primary="Brunch this weekend?"
                  secondary={
                    <React.Fragment>
                      <Typography component="span" className='MovieListItem' color="textPrimary">
                        {movie.title_long} - {movie.rating}
                        {/* <i className="material-icons">play_circle_outline</i> */}
                        <a rel="noopener noreferrer" target="_blank" href={youtubUrl} className="material-icons">play_circle_outline</a>
                      </Typography>
                      [ {movie.genres.join(' / ')} ]
                    </React.Fragment>
                  }
                />
              </ListItem>
        // return <li key={movie.id}> <img alt={movie.title_long} src={movie.small_cover_image} /> {movie.title_long} - {movie.rating} {movie.genres.join()}</li>;
     })
    return (
      <div className="MovieListdv">
         <h2>hello MovieLis2 ({this.state.liveCount})</h2>
         <List className="MovieListdv">
          {movieList}
         </List>
      </div>
    );
    
  }
}
 
MoviesList.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(MoviesList);