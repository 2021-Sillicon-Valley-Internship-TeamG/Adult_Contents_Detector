import LinearProgress from '@material-ui/core/LinearProgress';
//import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import { render } from '@testing-library/react';
import React from 'react';
import './css/detect.css'

class ProgressBar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            response_status_num : this.props.response_status_num
        }
    }
    
    render(){
        return (
        <div className='progress_bar'>
            <LinearProgress id='progress_bar' value={this.state.response_status_num} />
            {/*variant="determinate" */}
          </div>
        );
    }
}

export default ProgressBar;