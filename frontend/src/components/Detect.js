import React from 'react';
import { Redirect, withRouter  } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import Fab from '@material-ui/core/Fab';
import './css/detect.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const api = axios.create({
    baseURL: 'http://localhost:5000'
})

class Detect extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            page_change_flag : 0,           //button -> result
            btn_clicked_flag : 0,           //detectClick && -> flag = 1 
            response_data : "",              //back -> response -> result.js
            response_img_list : [],
            response_status : [],
            radio_value : ""
        };
    }

    //file 업로드 - 미리보기 함수
    //url upload 시, 처리 필요
    previewImg(e) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var img = document.createElement("img");
            img.setAttribute("src", e.target.result);
            img.setAttribute("width", "200");
            img.setAttribute("height", "200");
            document.querySelector("div#preview_div").appendChild(img);
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    detectClick(e) {
        e.preventDefault();
        var photoFile = document.getElementById("input_img")===null? undefined : document.getElementById("input_img");
        var url_input = document.getElementById("img_url")===null? undefined :  document.getElementById("img_url").value;
        var flag = 0;
        const detect_click_this = this;
        var status_sentence = detect_click_this.state.response_status;
        status_sentence.push(<h4>video uploading...</h4>)
            
        if(photoFile!==undefined) {
            this.setState({btn_clicked_flag: 1});  // set btn_flag = 1
            flag = this.file_api_call(photoFile);
        }
        else if(url_input !== ''){
            this.setState({btn_clicked_flag: 1});  // set btn_flag = 1
            flag = this.url_api_call(url_input);
        } else {
            // photoFile and url_input both are all empty -> pass
        }
    }

    //file 처리
    file_api_call(photoFile){
        var home_this = this;
        var formData = new FormData();
        formData.append("file", photoFile.files[0]);
        formData.append("image_type", "1");

        api.post('/videoUploading', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            console.log(response);
            var status_sentence = home_this.state.response_status;
            status_sentence.push(<h4>{response.data.video_filename} is uploaded</h4>)
            //const video_id = response.data.video_id
            home_this.setState({
                response_status : status_sentence,
                //video_id : video_id
            })
            return home_this.frame_uploading();
        }).catch(function (error) {
            console.log(error);
        });
    }

    url_api_call(url_input){
        const api = axios.create({
            baseURL: 'http://localhost:5000'
        })
        var home_this = this;
        var formData = new FormData();
        formData.append("image_url", url_input);
        formData.append("image_type", "0");
        
        api.post('/videoUploading', formData)
          .then(function (response) {
            console.log(response);
            //const video_id = response.data.result.video_id
            var status_sentence = home_this.state.response_status;
            status_sentence.push(<h4>{response.data.video_filename} is uploaded</h4>)
            home_this.setState({
                response_status : status_sentence
            })
            return home_this.frame_uploading();
        }).catch(function (error) {
            console.log(error);
          });
    }

    frame_uploading(){
        /*console.log(typeof video_id)
        var formData = new FormData();
        formData.append("video_id", video_id);
        */
        const api = axios.create({
            baseURL: 'http://localhost:5000'
        })
        var home_this = this;
        api.post('/frameUploading')
          .then(function (response) {
            console.log(response);
            var status_sentence = home_this.state.response_status;
            status_sentence.push(<h4>{response.data.result.frame_counts} frames are extracted from {response.data.result.video_filename}</h4>)
            home_this.setState({
                response_status : status_sentence
            })
            return setTimeout(function() {
                home_this.final_detect();
                return 1;
            }, 5000);
        }).catch(function (error) {
            console.log(error);
        });
    }

    //request detecting
    final_detect(){
        /*
        var formData = new FormData();
        formData.append("video_id", video_id);
        */

        const api = axios.create({
            baseURL: 'http://localhost:5000'
        })
        var home_this = this;
        api.post('/detectFinal')
          .then(function (response) {
            console.log(response);
            var status_sentence = home_this.state.response_status;
            status_sentence.push(<h4>detecting....</h4>)
            home_this.setState({
                response_status : status_sentence,
                response_data:response.data
            })
            return setTimeout(function() {
                home_this.make_img_list();
                return 1;
            }, 5000);
        }).catch(function (error) {
            console.log(error);
        });
    }

    make_img_list(){
        /*
        
        var formData = new FormData();
        formData.append("video_id", video_id);
        */
       var detect_this = this;
        const api = axios.create({
            baseURL: 'http://localhost:5000'
        })
        
        api.post('/frame')
        .then(function (response) {
            console.log(response.data);
            detect_this.setState({
                page_change_flag:1,
                response_img_list:response.data
            })
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleChange = (event) => {
        this.setState({radio_value : event.target.value});
        console.log(this.state.radio_value)
    };

    render(){
        // When loading is complete, go to "Result.js"
        let button;
        if(this.state.page_change_flag===1) {
            return <Redirect to={{
                pathname: '/result',
                state : {
                    //video_id : this.state.video_id,
                    response_data : this.state.response_data,
                    response_img_list : this.state.response_img_list
                }
            }}></Redirect>
        }
        let input_file = document.getElementById('input_img');

        return (
        <div id="detect_body" className="detect_main">
            <h1>Input Your Video</h1>
            <form id="img_input_form" runat="server" action="" method="post" onSubmit={this.detectClick.bind(this)}>
            
            <div id="radio_group" style={{position : 'relative', top : '10%', left : '45%', margin : '10px auto'}}>
            <RadioGroup row aria-label="gender" name="gender1" onChange={this.handleChange}>
                <FormControlLabel className="radio_btt" value="file" control={<Radio color="primary" />} label="File" />
                <FormControlLabel className="radio_btt" className="radio_btt" value="url" control={<Radio color="primary" />} label="URL" />
            </RadioGroup>
            </div>
            
            <div id="preview_div"></div>
            {this.state.radio_value!==''?
            <div className="form_div">
                {this.state.radio_value==='file'?
                <input className="user_input" type="file" name="input_img" id="input_img" onChange={this.previewImg.bind(this)}></input>
                :
                <input className="user_input" type="textarea" name = "input_url" id="img_url" placeholder="Input Youtube Video url"></input>
                }
            </div>
            :
            <div></div>
            }       
            </form>

            <Button boxShadow={3} id='detect_button' onClick={this.detectClick.bind(this)} variant="contained">DETECT</Button>
            

            <div className='progress_bar'>
                {this.state.btn_clicked_flag===0?
                <LinearProgress variant='determinate' id='progress_bar' value='0' />
                :
                <LinearProgress variant='indeterminate' id='progress_bar' value='0' />
                }
            </div>
            <h2>{this.state.response_status}</h2>

            <Fab id='back_button'>
            <ArrowBackIosOutlinedIcon onClick={()=> this.props.history.push('/')}/>
            </Fab>
        </div> 
        );
    }
}

class Log_Component extends React.Component{
    constructor(props){
        super(props);
        this.state={
            response_status : this.props.response_status
        }
    }
    render(){
        return (this.state.response_status.map((line) => (
            React.createElement('span', line,
            React.createElement('br'))
        )));
    }
}

export default withRouter(Detect);
