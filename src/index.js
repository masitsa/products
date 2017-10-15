import React from 'react';
import ReactDOM from 'react-dom';
//import { Router, Route, IndexRoute  } from 'react-router'
import { Route  } from 'react-router'
import { BrowserRouter, Link } from 'react-router-dom'

import './index.css';
import './vendors/bower_components/sweetalert/dist/sweetalert.css';
import './dist/css/font-awesome.min.css';
import './vendors/bower_components/fullcalendar/dist/fullcalendar.css';
import './dist/css/style.css';

var $ = require("jquery");
//var createReactClass = require('create-react-class');
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYmI5MzJmMC1lNjIyLTRmNDAtOTAzMy04M2UxOGViZmE2MmYiLCJzdWIiOiIxIiwidXNlck5hbWUiOiJBZG1pbiIsImVtYWlsIjoiamFtZXNAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiSmFtZXMiLCJsYXN0TmFtZSI6IktpcHJ1dG8iLCJwaG9uZSI6IisyNTQ3MTAzMTE3NTQiLCJnZW5kZXIiOiJNYWxlIiwicGFzc3dvcmQiOiJBUUFBQUFFQUFDY1FBQUFBRUFnNmRvQWIvbnF0MkpXMTVkb29VejdVRHJiZ2w2VW53aTBqMGRxU2RKRW43dXVvYnQ5d1JtU3QxbmFUczcwZ0JnPT0iLCJNYW5hZ2VVc2VycyI6IkFsbG93ZWQiLCJNYW5hZ2VUZW5hbnRzIjoiQWxsb3dlZCIsImV4cCI6MTUxMDU4NjQwMCwiaXNzIjoiaHR0cDovL3Byb2R1Y3RzLWFwcC5henVyZXdlYnNpdGVzLm5ldC8iLCJhdWQiOiJodHRwOi8vcHJvZHVjdHMtYXBwLmF6dXJld2Vic2l0ZXMubmV0LyJ9.NUba-smE2VGPxYadQIDjojSaXWlByX34pl66Sp2lGGg";

/**** Web Service Links *****/
var base_url = "http://products-app.azurewebsites.net/";
var products_url = base_url + "api/Products/getproducts/20/1";
var product_single_url = base_url + "api/Products/get/";
var product_insert_url = base_url + "api/Products/add";
var product_update_url = base_url + "api/Products/update";
var product_delete_url = base_url + "api/Products/delete/";

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
		//this.editProduct = this.editProductDetails.bind(this);
    }
	
	componentDidMount() {
		//Retrieve products from web service
		//localStorage.clear();
		var string_items = window.localStorage.getItem("string_items");
		var total_items = window.localStorage.getItem("total_items");
		
		//Fetch if local storage does not exist
		if((string_items === "") || (string_items === null) || (string_items === false) || (total_items <= 0) || (total_items === "") || (total_items === null) || (total_items === false))
		{
			fetch(products_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json'
				}
			})
			.then(function(response) 
			{
				//console.log(response);
				
				var success = response.ok;
				
				if(success === false)
				{
					alert("An error occured: " + response.statusText);
				}
				
				else
				{
					return response.json();
				}
				 
			}).then(function(data) {
				var total_items = parseInt(data.totalItems, 10);
				if(total_items > 0)
				{
					var json_items = data.products;
					
					//Save in browser Session
					window.localStorage.setItem("output_items", JSON.stringify(json_items));
					window.localStorage.setItem("total_items", total_items);
				}
			});
		}
		
		$(".preloader-it").delay(500).fadeOut("slow");
	}
	
    render() {
		
		var output_items = window.localStorage.getItem("output_items");
		//var total_items = window.localStorage.getItem("total_items");
		
		if((output_items !== "") || (output_items !== null))
		{
			output_items = JSON.parse(output_items);
		}
		console.log(output_items);
		if( Object.prototype.toString.call( output_items ) !== '[object Array]' )
		{
			output_items = [];
		}
		
        return (
			<div className="container-fluid">
				<div className="panel panel-default card-view">
					<div className="panel-wrapper collapse in">
						<div className="panel-body">
							<div className="row heading-bg">
								<div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
									<h5 className="txt-dark">products</h5>
								</div>
								<div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
									<ol className="breadcrumb">
										<li className="active"><span>Products</span></li>
									</ol>
								</div>
							</div>
							
							<div className="row">
								<div className="col-md-12">
									<table className="table table-bordered">
										<thead>
											<tr>
												<th>#</th>
												<th>Name</th>
												<th>Unit Price</th>
												<th>Discount</th>
												<th>Availability</th>
												<th>Created</th>
												<th>Modified</th>
												<th colSpan="2">Actions</th>
											</tr>
										</thead>
										<tbody>
											{
												output_items.map(function(ub) {
													return (
														<tr>
															<td></td>
															<td>{ub.name}</td>
															<td>{ub.unitPrice}</td>
															<td>{ub.discount}</td>
															<td>{ub.isAvailable}</td>
															<td>{ub.created}</td>
															<td>{ub.modified}</td>
															<td><Link to={{ pathname: '/editProductItem', query: { product_id: ub.id } }}><button className="btn btn-warning font-18 txt-white mr-10"><i className="zmdi zmdi-edit"></i></button></Link></td>
															<td><Link to={{ pathname: '/deleteProductItem', query: { product_id: ub.id } }}><button className="btn btn-danger font-18 txt-white mr-10"><i className="fa fa-trash"></i></button></Link></td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		)
    }
}

class EditProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
		
        this.onSubmitProductUpdate = this.updateProduct.bind(this);
        this.handleEditIdForm = this.handleIdChange.bind(this);
        this.handleEditNameForm = this.handleNameChange.bind(this);
        this.handleEditPriceForm = this.handlePriceChange.bind(this);
        this.handleEditDiscountForm = this.handleDiscountChange.bind(this);
        this.handleEditAvailabilityFormYes = this.handleAvailabilityChangeYes.bind(this);
        this.handleEditAvailabilityFormNo = this.handleAvailabilityChangeNo.bind(this);
    }
	
	componentDidMount() {
		$(".preloader-it").delay(500).fadeOut("slow");
	}

    handleNameChange(e) {
        this.setState({product_name: e.target.value});
    }

    handleIdChange(e) {
        this.setState({product_id: e.target.value});
    }

    handlePriceChange(e) {
        this.setState({product_price: e.target.value});
    }

    handleDiscountChange(e) {
        this.setState({product_discount: e.target.value});
    }

    handleAvailabilityChangeYes(e) {
        this.setState({product_availability: e.target.value});
    }

    handleAvailabilityChangeNo(e) {
        this.setState({product_availability: e.target.value});
    }

    updateProduct(event) 
	{
        event.preventDefault();
		var product_id = this.state.product_id;
		var product_name = this.state.product_name;
		var product_availability = this.state.product_availability;
		var product_price = this.state.product_price;
		var product_discount = this.state.product_discount;
		alert('An ID was submitted: ' + product_id);
		
		var product_av;
		if(product_availability === "true")
		{
			product_av = true;
		}
		
		else
		{
			product_av = false;
		}
        fetch(product_update_url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': "Bearer " + token,
				'Content-Type': 'application/json'
			},

			//make sure to serialize your JSON body
			body: JSON.stringify({
				name: product_name,
				unitPrice: product_price,
				discount: product_discount,
				isAvailable: product_av,
				id: product_id
			})
		})
		.then(function(response) 
		{
			var success = response.ok;
			
			if(success === false)
			{
				alert("An error occured: " + response.statusText);
			}
			
			else
			{
				return response.json();
			}
			 
		}).then(function(data) {
			fetch(products_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json'
				}
			})
			.then(function(response) 
			{
				//console.log(response);
				
				var success = response.ok;
				
				if(success === false)
				{
					alert("An error occured: " + response.statusText);
				}
				
				else
				{
					return response.json();
				}
				 
			}).then(function(data) {
				var total_items = parseInt(data.totalItems, 10);
				if(total_items > 0)
				{
					var json_items = data.products;
					
					//Save in browser Session
					window.localStorage.setItem("output_items", JSON.stringify(json_items));
					window.localStorage.setItem("total_items", total_items);
				}
			});
		});
        //alert('A name was submitted: ' + this.state.value);
    }
	
    render() {
        console.log("Props are: ");
        console.log(this);
		var display = "";
		if (typeof this.props.location.query !== 'undefined') 
		{
			var product_id = this.props.location.query.product_id;
			
			fetch(product_single_url + product_id, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json'
				}
			})
			.then(function(response) 
			{
				//console.log(response);
				
				var success = response.ok;
				
				if(success === false)
				{
					alert("An error occured: " + response.statusText);
				}
				
				else
				{
					return response.json();
				}
				 
			}).then(function(data) {
				console.log("single product data");
				console.log(data);
				
				var db_availabile = data.isAvailable;
				var db_name = data.name;
				var db_price = data.unitPrice;
				var db_discount = data.discount;
				var db_id = data.id;
				
				$("#product_id").val(db_id);
				$("#product_name").val(db_name);
				$("#product_price").val(db_price);
				$("#product_discount").val(db_discount);
				
				if(db_availabile)
				{
					$("#available_yes").prop('checked', true);
				}
				
				else
				{
					$("#available_no").prop('checked', true);
				}
			});
		}
		
		else
		{
			display = <div><p>Product not found</p></div>;
			
			return (
				display
			);
		}
		
		return (
			<div className="container-fluid">
				<div className="panel panel-default card-view">
					<div className="panel-wrapper collapse in">
						<div className="panel-body">
							<div className="row heading-bg">
								<div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
									<h5 className="txt-dark">Edit</h5>
								</div>
								<div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
									<ol className="breadcrumb">
										<li><a href="/products">Products</a></li>
										<li className="active"><span>Edit </span></li>
									</ol>
								</div>
							</div>
							
							<div className="row">
								<div className="col-md-6 col-md-offset-3">
									<div className="panel panel-default card-view">
										<div className="panel-heading">
											<div className="pull-left">
												<h6 className="panel-title txt-dark">Edit</h6>
											</div>
											<div className="clearfix"></div>
										</div>
										<div className="panel-wrapper collapse in">
											<div className="panel-body">
												<div className="form-wrap">
													<form onSubmit = {this.onSubmitProductUpdate}>
														<input id="product_id" name="product_id" type="hidden" onChange={this.handleEditIdForm}/>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Product Name</label>
															<input id="product_name" name="product_name" className="form-control" type="text" onChange={this.handleEditNameForm}/>
														</div>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Product Price</label>
															<input id="product_price" name="product_price" className="form-control"  type="text" onChange={this.handleEditPriceForm}/>
														</div>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Price Discount</label>
															<input id="product_discount" name="product_discount" className="form-control" type="text" onChange={this.handleEditDiscountForm}/>
														</div>
														
														<div className="form-group mb-30">
															<label className="control-label mb-10 text-left">Product Availability</label>
															
															<div className="radio radio-info">
																<input id="available_yes" name="product_availability" id="radio1" value="true" type="radio" onChange={this.handleEditAvailabilityFormYes}/>
																<label>
																	Yes
																</label>
															</div>
															<div className="radio radio-info">
																<input id="available_no" name="product_availability" id="radio2" value="false" type="radio" onChange={this.handleEditAvailabilityFormNo}/>
																<label>
																	No
																</label>
															</div>
														</div>
														
														<div className="form-group mb0">
															<div className="col-sm-offset-2 col-sm-10">
															  <button type="submit" className="btn btn-primary btn-anim"><i className="fa fa-pencil"></i><span className="btn-text">Update</span></button>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
			
							</div>
							
						</div>
					</div>
				</div>
			</div>
		);
    }
}

class DeleteProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }
	
	componentDidMount() {
		$(".preloader-it").delay(500).fadeOut("slow");
	}
	
	delete_single_product(product_id) {
		
		var r = window.confirm("Are you sure you want to delete this item?");
		if (r === true) {
			fetch(product_delete_url + product_id, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json'
				}
			})
			.then(function(response) 
			{
				//console.log(response);
				
				var success = response.ok;
				
				if(success === false)
				{
					alert("An error occured: " + response.statusText);
				}
				
				else
				{
					alert("Success: " + response.statusText);
				}
				 
			}).then(function(data) {
				fetch(products_url, {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Authorization': "Bearer " + token,
						'Content-Type': 'application/json'
					}
				})
				.then(function(response) 
				{
					//console.log(response);
					
					var success = response.ok;
					
					if(success === false)
					{
						alert("An error occured: " + response.statusText);
					}
					
					else
					{
						return response.json();
					}
					 
				}).then(function(data) {
					var total_items = parseInt(data.totalItems, 10);
					if(total_items > 0)
					{
						var json_items = data.products;
						
						//Save in browser Session
						window.localStorage.setItem("output_items", JSON.stringify(json_items));
						window.localStorage.setItem("total_items", total_items);
					}
				});
			});
		}
		
    }
	
    render() {
        console.log("Props are: ");
        console.log(this);
		
		if (typeof this.props.location.query !== 'undefined') 
		{
			var product_id = this.props.location.query.product_id;
			
			this.delete_single_product(product_id);
			return (
				<div className="alert alert-success"><p>Product Deleted Successfully</p></div>
			);
		}
		
		else
		{
			return (
				<div className="alert alert-success"><p>Product not found</p></div>
			);
		}
    }
}

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
		
        this.onSubmitProductInsert = this.insertProduct.bind(this);
		
        this.handleNameAddForm = this.handleNameAdd.bind(this);
        this.handleAddPriceForm = this.handlePriceAdd.bind(this);
        this.handleAddDiscountForm = this.handleDiscountAdd.bind(this);
        this.handleAddAvailabilityForm = this.handleAvailabilityAdd.bind(this);
    }
	
	componentDidMount() {
		$(".preloader-it").delay(500).fadeOut("slow");
	}

    handleNameAdd(e) {
        this.setState({product_name: e.target.value});
    }

    handlePriceAdd(e) {
        this.setState({product_price: e.target.value});
    }

    handleDiscountAdd(e) {
        this.setState({product_discount: e.target.value});
    }

    handleAvailabilityAdd(e) {
        this.setState({product_availability: e.target.value});
    }

    insertProduct(event) 
	{
        event.preventDefault();
		
		var product_name = this.state.product_name;
		var product_price = this.state.product_price;
		var product_discount = this.state.product_discount;
		var product_availability = this.state.product_availability;
		
		alert('An item was submitted: ' + product_name);
		
		var product_av;
		if(product_availability === "true")
		{
			product_av = true;
		}
		
		else
		{
			product_av = false;
		}
        fetch(product_insert_url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': "Bearer " + token,
				'Content-Type': 'application/json'
			},

			//make sure to serialize your JSON body
			body: JSON.stringify({
				name: product_name,
				unitPrice: product_price,
				discount: product_discount,
				isAvailable: product_av
			})
		})
		.then(function(response) 
		{
			//console.log(response);
			
			var success = response.ok;
			
			if(success === false)
			{
				alert("An error occured: " + response.statusText);
			}
			
			else
			{
				alert("Success: " + response.statusText);
			}
			 
		}).then(function(data) {
			fetch(products_url, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json'
				}
			})
			.then(function(response) 
			{
				//console.log(response);
				
				var success = response.ok;
				
				if(success === false)
				{
					alert("An error occured: " + response.statusText);
				}
				
				else
				{
					return response.json();
				}
				 
			}).then(function(data) {
				var total_items = parseInt(data.totalItems, 10);
				if(total_items > 0)
				{
					var json_items = data.products;
					
					//Save in browser Session
					window.localStorage.setItem("output_items", JSON.stringify(json_items));
					window.localStorage.setItem("total_items", total_items);
				}
			});
		});
    }
	
	
    render() {
		return (
			<div className="container-fluid">
				<div className="panel panel-default card-view">
					<div className="panel-wrapper collapse in">
						<div className="panel-body">
							<div className="row heading-bg">
								<div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
									<h5 className="txt-dark">Add Product</h5>
								</div>
								<div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
									<ol className="breadcrumb">
										<li><a href="/products">Products</a></li>
										<li className="active"><span>Add Product</span></li>
									</ol>
								</div>
							</div>
							
							<div className="row">
								<div className="col-md-6 col-md-offset-3">
									<div className="panel panel-default card-view">
										<div className="panel-heading">
											<div className="pull-left">
												<h6 className="panel-title txt-dark">Add Product</h6>
											</div>
											<div className="clearfix"></div>
										</div>
										<div className="panel-wrapper collapse in">
											<div className="panel-body">
												<div className="form-wrap">
													<form onSubmit = {this.onSubmitProductInsert}>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Product Name</label>
															<input name="product_name_add" className="form-control" type="text" onChange={this.handleNameAddForm}/>
														</div>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Product Price</label>
															<input name="product_price" className="form-control" type="text" onChange={this.handleAddPriceForm}/>
														</div>
														<div className="form-group">
															<label className="control-label mb-10 text-left">Price Discount</label>
															<input name="product_discount" className="form-control" type="text" onChange={this.handleAddDiscountForm}/>
														</div>
														
														<div className="form-group mb-30">
															<label className="control-label mb-10 text-left">Product Availability</label>
															<div className="radio radio-info">
																<input name="product_availability" id="radio1" value="true" checked="checked" type="radio" onChange={this.handleAddAvailabilityForm}/>
																<label>
																	Yes
																</label>
															</div>
															<div className="radio radio-info">
																<input name="product_availability" id="radio2" value="false" type="radio" onChange={this.handleAddAvailabilityForm}/>
																<label>
																	No
																</label>
															</div>	
														</div>
														
														<div className="form-group mb0">
															<div className="col-sm-offset-2 col-sm-10">
															  <button type="submit" className="btn btn-primary btn-lg btn-anim"><i className="fa fa-plus"></i><span className="btn-text">Add Product</span></button>
															</div>
														</div>
														
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
			
							</div>
							
						</div>
					</div>
				</div>
			</div>
		);
    }
}

ReactDOM.render(
	<BrowserRouter path="/" component={Products}>
		<div>
			<Route path="/" component={Products} />
			<Route name="products" path="/products" component={Products} />
			<Route name="addProduct" path="/addProduct" component={AddProduct} />
			<Route name="editProductItem" path="/editProductItem" handler={EditProduct} component={EditProduct} />
			<Route name="deleteProductItem" path="/deleteProductItem" handler={DeleteProduct} component={DeleteProduct} />
		</div>
	</BrowserRouter>,
    document.getElementById('root')
);