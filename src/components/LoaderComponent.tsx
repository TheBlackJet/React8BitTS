import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

//interface ITableComponent

class LoaderComponent extends React.Component<{ LoaderProps }, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
            defaultText: ""
        }
    }

    componentWillMount() {


    }


    showHideLogic() {
        // if (this.props.global.text && !this.props.global.redirect) {
        //     this.props.history.push("/list");
        // }
    }

    render() {

        if (this.props.global.redirect) {
            return <div className="row-12-xs loader" style={this.props.style}>{this.props.global.text}</div>
        } else {
            //this.showHideLogic();
            return <div></div>
        }

    }

}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({

    }, dispatch)
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoaderComponent));