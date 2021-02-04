import { render } from '@testing-library/react';
import React from 'react';
import { Link , withRouter } from 'react-router-dom';
import './css/home.css'
import Button from '@material-ui/core/Button'


class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        return (
        <div className="home">
            <h1>Adult Contents Detector</h1>
            <p id='kor_desc'>
            '유해 콘텐츠 판별 어플리케이션'은 유해 콘텐츠를 판별하는 웹 어플리케이션입니다.<br></br>
            <br></br>
            CNN AI가 입력된 파일과 URL의 동영상을 판별합니다.<br></br>
            판별이 끝나면, 동영상에서 추출된 각 프레임들의 결과를 볼 수 있고, 
            각 프레임들을 재판별할 수 있습니다.
            </p>
            <hr></hr>
            <p id='en_desc'>
            'Adult Contents Detector' is a Web Application that can detect harmful contents.<br></br>
            <br></br>
            The CNN AI model determines local files or URLs.<br></br> 
            When detection is complete, 
            you are allowed to view all detected frames and change the detection result.<br></br>
            </p>
            <Button boxShadow={3} id='start_button' variant="contained" component={Link} to={'/detect'}>START</Button>
        </div>
        );
    }
}

export default withRouter(Home);