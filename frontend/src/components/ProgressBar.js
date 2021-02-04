import LinearProgress from '@material-ui/core/LinearProgress';
//import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import { render } from '@testing-library/react';
import React from 'react';
import './css/detect.css'

class ProgressBar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            btn_clicked_flag : this.props.btn_clicked_flag
        }
    }
    
    render(){
        console.log(this.state.btn_clicked_flag)
        let linear_progree_bar;

        if(this.state.btn_clicked_flag===0) {
            linear_progree_bar = <LinearProgress variant='determinate' id='progress_bar' value='0' />;
        }
        else{
            linear_progree_bar = <LinearProgress id='progress_bar'/>
        }

        return (
        <div className='progress_bar'>
            {linear_progree_bar}
          </div>
        );
    }
}

export default ProgressBar;