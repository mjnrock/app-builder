import React, { Component } from "react";

class Modal extends Component {
	render() {
		return (
			<div>
				<div>
					<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#current-modal">{ this.props.label }</button>
				</div>
				<div id="current-modal" className="modal" tabIndex="-1" role="dialog">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{ this.props.title }</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								{
									this.props.body
								}
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-primary">Okay</button>
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export { Modal };