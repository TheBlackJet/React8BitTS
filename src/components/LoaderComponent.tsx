import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";


//interface ITableComponent

class LoaderComponent extends React.Component<{}, {}> {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidUpdate(){
        //debugger
        // if (this.props.redirect){
        //     this.props.history.push(this.props.path);
        // }
    }


    render() {
       return <div className="row-12-xs loader">The request has been processed. Please wait for a few moment. Thank you! </div>
    }

}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        
    }, dispatch)
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderComponent);