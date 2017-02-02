var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	user: 'root',

	password: 'Jimmyisthebest88',
	database: 'bamazon'
});

var stock = [];
var spaceOne = ' ';
var spaceTwo = ' ';
var spaceThree = ' ';

var run = function(){
	showStock();
};

var showStock = function(){
	connection.query('SELECT * FROM products',function(err, res){
		console.log('| ID |              Name              |       Price       |     Quantity    |');
		for (i=0; i<10; i++){
			var hold;
			spaceOne = '';
			spaceTwo = '';
			spaceThree = '';
			hold = 8 - res[i].item_id.toString().length;
			for (a=0; a<hold; a++){
				spaceOne += ' ';
			};
			hold = 51 - (res[i].item_id.toString().length + spaceOne.length + res[i].product_name.length + res[i].price.toFixed(2).toString().length);
			for (b=0; b<hold; b++){
				spaceTwo += ' ';
			};
			hold = 17 - res[i].stock_quantity.toString().length;
			for (c=0; c<hold; c++){
				spaceThree += ' ';
			}
			console.log('  ' + res[i].item_id + spaceOne + res[i].product_name + spaceTwo + '$' + res[i].price.toFixed(2) + spaceThree + res[i].stock_quantity);
		};
		stock = res;
		buy();
	});
};

var buy = function(){
	var item;
	var quant;
	inquirer.prompt([
		{
	        name: 'item',
	        message: 'What is the ID of the item you like to purchase?',
	    }, {
	      	name: 'quantity',
	      	message: 'How much would you like to purchase?:'
	    }

	]).then(function(purchase) {
		var purchaseItem = stock[purchase.item-1];
		if (purchase.quantity > purchaseItem.stock_quantity){
			console.log('That exceeds the stores quantity.');
			buy();
		} else {
			console.log('The price comes to ' + purchase.quantity * purchaseItem.price);
			connection.query('UPDATE products SET ? WHERE ?',
				[
					{stock_quantity: purchaseItem.stock_quantity - purchase.quantity},
					{item_id: purchaseItem.item_id}
				]
				,function(err, res) {if (err) throw err;});
			connection.end();
		}
	});
};

run();