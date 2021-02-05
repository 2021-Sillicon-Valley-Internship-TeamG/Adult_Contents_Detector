import { render } from '@testing-library/react';
import {withRouter } from 'react-router-dom';
import React from 'react';
import ReactPlayer from 'react-player'
import './css/result.css'
import Hor_bar_chart from './Hor_bar_chart'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import Fab from '@material-ui/core/Fab';
import axios from 'axios';

class Result extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading : 0,
            //video_id : this.props.location.state.video_id,
            response_data : this.props.location.state.response_data,
            response_img_list : this.props.location.state.response_img_list.img_dict,
            changed_img_list : [],
            Res_G : 0,
            Res_PG : 0,
            Res_R : 0,
            video_final_censored : "",
            // For video Player state
            playing: true,
            seeking: true,
            played: 0,
            duration : 0
        }
    }
    
    gogogogogo(){
        var loading_this = this;
        setTimeout(function() {
            loading_this.setState({loading : 1})
            console.log('loading'+loading_this.state.loading)
        }, 1000);
    }
    make_Video(){
        const { playing } = this.state
        const _Video_URL = this.state.response_data.result.video_URL;
        //console.log(_Video_URL);
        return  <ReactPlayer
        playing={playing}
        ref = {this.ref}
        controls
        url = {_Video_URL}
        className='react-player'
        width="800px"
        height="800px"
        onDuration={this.handleDutation}/>;
    }
    handleDutation = (duration) =>{
        this.setState({duration})
    }
    handleSeekBtn = e => {
        const img_time = Number(e.target.getAttribute('value'))/1000;
        const img_time_divided = img_time/this.state.duration
        console.log(img_time)
        this.setState({ seeking: true })
        this.setState( {played: parseFloat(img_time_divided) })
        this.setState({ playing: !this.state.playing })
        this.player.seekTo(parseFloat(img_time_divided))
    }
    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }
    ref = player => {
        this.player = player
    }

    make_image_list(){
        var img_lists = [];
        var data = this.state.response_img_list;
        var i=0;
        while(i<Object.keys(data).length){
            const img_id = data[i].id
            img_lists.push(<div key={data[i].id} className='frame_prt_div'>
                <div id={img_id} className={data[i].ml_censored}>
                <img
                className='frame_img'
                id={data[i].id}
                src={data[i].location}
                alt='nope'
                value={data[i].time_frame}
                censored = {data[i].ml_censored}
                onClick={this.handleSeekBtn}
                ></img>
                </div>
                <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                onChange={ (e) => { this.handle_select_change(e, img_id); } }
                defaultValue={data[i].ml_censored}
                >
                    <MenuItem value='G'>G</MenuItem>
                    <MenuItem value='PG'>PG</MenuItem>
                    <MenuItem value='R'>R</MenuItem>
                </Select>
                </div>)
            i=i+1;
        }
        return(
            <div class="img_list">
                {img_lists}
            </div>
        );
    }
    
    //처음, save버튼 눌렀을 때만 실행
    make_rate_censored(){
        console.log("make_rate_censored_function")
        const data = this.state.response_img_list;
        console.log(data)
        const length_t = Object.keys(this.state.response_img_list).length;
        const check_censored_this = this;
        var i=0;
        var censored_R = 0;
        var censored_PG = 0;
        var censored_G = 0;
        var _video_final_censored = ""
        while(i<Object.keys(data).length){
            if(data[i].ml_censored==='R'){
                censored_R++;
            }
            else if(data[i].ml_censored==='PG'){
                censored_PG++;
            }
            else {
                censored_G++;
            }
            i=i+1;
        }
        //확률 계산
        censored_R = censored_R/length_t * 100; censored_PG = censored_PG/length_t * 100; censored_G = censored_G/length_t * 100; 

        if(censored_R === 0.0 && censored_PG <= 20.0){
            _video_final_censored = "전체 이용가"
        } else if(censored_R <= 20.0) {
            _video_final_censored = "15세 이용가"
        } else {
            _video_final_censored = "19세 이용가"
        }
        setTimeout(function() {
        check_censored_this.setState({
            Res_G : censored_G,
            Res_PG : censored_PG,
            Res_R : censored_R,
            video_final_censored : _video_final_censored
        });
        console.log(check_censored_this.state.video_final_censored)
        }, 1000);
    }

    make_Result(){
        console.log('mr')
        var make_Result_this = this;
        console.log(make_Result_this.state.video_final_censored)
        return <Video_censored video_final_censored = {make_Result_this.state.video_final_censored}></Video_censored>
    }
    
    /////// event Handler ///////
    //select 선택 value 바뀌는 이벤트 처리 함수 : 바뀐 데이터로 state 업데이트
    handle_select_change = (e, _id) => {
        const img_censored = e.target.value;
        const img_id = _id;
        document.getElementById(img_id).className=img_censored
        //업데이트된 frame 붙여주기
        var _changed_img_list = this.state.changed_img_list.concat(
            {id : img_id,  censored : img_censored}
        )
        var _original_contents = this.state.response_img_list;
        var i=0;
        console.log('before')
        console.log(_original_contents)
        console.log(img_censored)
        while(i<Object.keys(_original_contents).length){
            console.log(_original_contents[i].id)
            console.log(_id)
            if (_original_contents[i].id  === _id) {
                _original_contents[i] = {id:_id,
                                        location:_original_contents[i].location,
                                        ml_censored:img_censored,
                                        time_frame:_original_contents[i].time_frame,};
                break;
            }
            i=i+1;
        }
        console.log('after')
        console.log(_original_contents)
        this.setState({
            changed_img_list : _changed_img_list,
            response_img_list : _original_contents
        });
    };
    //save button 이벤트 처리 함수 : 바뀐 데이터 실어서 보냄
    click_save = () => {
        var click_save_this = this;
        console.log('click_save')
        console.log(this.state.changed_img_list)
        //console.log(this.state.video_id)
        const api = axios.create({
            baseURL: 'http://localhost:5000'
        })
        
        var send_changed_censored = this.state.changed_img_list //바뀐 데이터
        click_save_this.make_rate_censored();                   //바뀐 데이터 적용해서 비율 적용
        var final_video_censored=""

        /*
        const video_id = this.state.video_id;
        var formData = new FormData();
        formData.append("video_id", video_id);
        */

        // 마찬가지로 바뀐 video_censored 넣어서 보내야 함!
        setTimeout(function() {
            final_video_censored = click_save_this.state.video_final_censored;
            //업데이트된 비디오 censored 업데이트
            var send_changed_censored = click_save_this.state.changed_img_list.concat(
                {id : 0,  censored : click_save_this.state.video_final_censored}
            )
            //formData.append("changed_lists", send_changed_censored);
            api.post('/update', send_changed_censored)
              .then(function (response) {
                  console.log(response.data.changed_count);
                  console.log('pls'+final_video_censored)
                  click_save_this.setState({
                      video_final_censored : final_video_censored,
                      loading : 2
                  });
                  click_save_this.make_rate_censored(); 
            }).catch(function (error) {
                console.log(error);
            });
        }, 1000);
    }

    render(){
        if(this.state.Res_PG+this.state.Res_R+this.state.Res_G === 0){
            this.make_rate_censored();
        }
        if(this.state.loading === 0 || this.state.loading === 2) {
            this.gogogogogo();
            return(
                <div id="loading">
                    {this.state.loading===0? <h1 id="loading_log"></h1> : <h1></h1>}
                </div>
            )
        }
        else{
        return (
        <div id='result_body' className="result">
        <div align="center">
            </div>
            <Grid id="result_grid" container spacing={1} item align="center" justify="center">
                <Grid className='MuiGrid-align-items-xs-center' xs={12} sm={7}>
                    <div className='player-wrapper'>{this.make_Video()}</div>
                    <br></br>
                    {this.make_Result()}
                </Grid>
                <Grid className='MuiGrid-align-items-xs-center' item justify="center" align="center" xs={12} sm={5}>
                <Hor_bar_chart Res_G={this.state.Res_G} Res_PG={this.state.Res_PG} Res_R={this.state.Res_R} ></Hor_bar_chart>
                {this.make_image_list()}
                <Grid
                container
                justify="center"
                align="center"
                >
                <Button boxShadow={3} id='save_button' variant="contained" onClick={this.click_save}><strong>SAVE</strong></Button>
                </Grid>
                </Grid>
            </Grid>
            
            <div>
            <input
            type='range' min={0} max={0.999999} step='any'
            value={this.state.played}
            onChange={this.handleSeekChange}
            style={{display:'none'}}/>
            </div>
            <Fab id='back_button'>
            <ArrowBackIosOutlinedIcon onClick={()=> this.props.history.push('/detect')}/>
            </Fab>
        </div>
        );
        }
    }
}
export default withRouter(Result);

//video 판별 결과 텍스트 출력 컴포넌트
class Video_censored extends React.Component{
    constructor(props){
        super(props);
        this.state={
            video_final_censored : this.props.video_final_censored,
            video_final_changed : false
        }
    }
    render(){
        return (
        <div className="video_censored">
            <h3>이 동영상은 {this.state.video_final_censored} 입니다.</h3>
        </div>
        );
    }
}