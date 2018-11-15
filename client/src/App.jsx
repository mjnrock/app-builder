import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Routes from "./routes/package";

// import PTO from "./lib/pto/package";
import Core from "./core/package";

//! Remarkable
//* Demo
//	https://jonschlinkert.github.io/remarkable/demo/
//* NPM
//	https://www.npmjs.com/package/remarkable
//* Usage
// import Remarkable from "remarkable";
// <div dangerouslySetInnerHTML={ {__html: this.Remarkable.render("Hello, **world**!")} }></div>

//!	Facebook Open Source
//	https://opensource.fb.com/
//*	https://yogalayout.com/
//*	https://draftjs.org/
//*	https://graphql.org/
//*	https://osquery.io/
//*	https://facebook.github.io/react-360/

	
//! Move these into an appropriate class for use with the GUI bindings and forms
// static GetAllParameters = (func) => {
// 	return (func + '')
// 		.replace(/[/][/].*$/mg,'') // strip single-line comments
// 		.replace(/\s+/g, '') // strip white space
// 		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
// 		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
// 		.replace(/=[^,]+/g, '') // strip any ES6 defaults  
// 		.split(',').filter(Boolean); // split & filter [""]
// }
// static GetAllMethods = (obj) => {
// 	let props = []

// 	do {
// 		const l = Object.getOwnPropertyNames(obj)
// 			.concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
// 			.sort()
// 			.filter((p, i, arr) => {
// 				console.log(p, i, arr);

// 				return typeof obj[p] === 'function' &&  //only the methods
// 				p !== 'constructor' &&           //not the constructor
// 				(i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
// 				props.indexOf(p) === -1          //not overridden in a child
// 			})
// 		props = props.concat(l)
// 	}
// 	while (
// 		(obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
// 		Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
// 	)

// 	return props
// }

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/tag/builder" component={ (router) => <Routes.TagBuilder Router={ router } Core={ Core } /> } />
					<Route exact path="/ds" component={ (router) => <Routes.DataSource Router={ router } Core={ Core } /> } />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;