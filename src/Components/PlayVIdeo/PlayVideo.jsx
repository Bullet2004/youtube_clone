import React, { use, useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from  '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY,value_converter } from '../../data'
import moment from 'moment';
import { data, useParams } from 'react-router-dom'

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);

    const fetchVideoData = async () => {
        //Fetching Videos Data
        const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(response=>response.json()).then(data=>setApiData(data.items[0]));
    }

    const fetchOtherData = async () => {
        //Fetching Channel Data
        const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(response=>response.json()).then(data=>setChannelData(data.items[0]));

        //Fetching Comment Data
        const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=50&videoId=${videoId}&maxResults=20&key=${API_KEY}`;
        await fetch(comment_url).then(response=>response.json()).then(data=>setCommentData(data.items));

    }

    

    useEffect(()=>{
        fetchVideoData();
    },[videoId])

    useEffect(()=>{
        fetchOtherData();
    },[apiData])

  return (
    <div className="play-video">
        {/* <video src={video1} controls autoPlay muted></video> */}
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className="play-video-info">
        <p>
        {apiData ? value_converter(apiData.statistics?.viewCount || 0) : "0"} Views &bull;{" "}
        {apiData ? moment(apiData.snippet?.publishedAt).fromNow() : ""}
        </p>
            <div>
                <span><img src={like} alt="" />{apiData?value_converter(apiData.statistics.likeCount):0}</span>
                <span><img src={dislike} alt="" />{apiData?value_converter(apiData.statistics.dislikeCount):0}</span>
                <span><img src={share} alt="" />Share</span>
                <span><img src={save} alt="" />Save</span>
            </div>
        </div>
        <hr />
        <div className="publisher">
            <img src={channelData?channelData.snippet.thumbnails.default.url:""} alt="" />
            <div>
                <p>{apiData?apiData.snippet.channelTitle:"Author"}</p>
                <span>{channelData?value_converter(channelData.statistics.subscriberCount):"1"} Subcribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className="vid-description">
            <p>{apiData?apiData.snippet.description.slice(0,250):"Description Here"}</p>
            <p>Subscribe GreatStack to watch more video tutorials.</p>
            <hr />
            <h4>{apiData?value_converter(apiData.statistics.commentCount):"0"} Comments</h4>
            {commentData.map((item,index)=>{
                return(
                    <div key={index} className="comment">
                    <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                    <div>
                        <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                        <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                        <div className="comment-action">
                            <img src={like} alt="" />
                            <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                            <img src={dislike} alt="" />
                        </div>
                    </div>
                </div>
                )
            })}
        </div>
    </div>
  )
}

export default PlayVideo