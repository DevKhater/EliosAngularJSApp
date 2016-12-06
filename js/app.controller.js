var app = angular.module('mainApp', ['ngRoute']);
app.config([
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: "views/home.html"
		});
	}]);

app.controller('mainCtrl', function($scope){
	$scope.Prices = [
		{'id': 1, 'min': 0, 'max': 50, 'price': 0.12},
		{'id': 2, 'min': 51, 'max': 100, 'price': 0.21},
		{'id': 3, 'min': 101, 'max': 200, 'price': 0.22},
		{'id': 4, 'min': 201, 'max': 350, 'price': 0.43},
		{'id': 5, 'min': 351, 'max': 650, 'price': 0.55},
		{'id': 6, 'min': 651, 'max': 1000, 'price': 0.95},
		{'id': 7, 'min': 1001, 'max': null, 'price': 0.98},
	];
	$scope.userSelect = false;
	$scope.results =  [];
	$scope.userData = {};
	$scope.output = null;
	$scope.totalCalculation = [];
	$scope.BulbSpecification = function(name, watt, thecon, url){
		return {
			'name': name,
			'watt': watt,
			'thecon': thecon,
			'img': url
		};
	};
	$scope.loadData = function() {
		return [
			new $scope.BulbSpecification("GLS", [15, 25, 40, 60, 75, 100, 150, 200], 13, 'img/GLS.png'),
			new $scope.BulbSpecification("CFL", [7, 9, 11, 13, 18, 23, 30, 32, 40, 60, 85], 60, 'img/CFL.png'),
			new $scope.BulbSpecification("LED", [2, 3, 4, 5, 6, 9, 12, 15], 100, 'img/LED.png'),
		];
	};
	$scope.submitUserSelectSliceForm = function(data){
		$scope.userSelect = true;
		$scope.allBulbsData = $scope.loadData();
	};

	$scope.addUserData = function(){
		if ($scope.userData.number != null && $scope.userData.watt != null && $scope.userData.BulbType != null) {
			$scope.totalCalculation.push(
				{
					'bulb': $scope.userData.BulbType, 'number': $scope.userData.number, 'watt': $scope.userData.watt
				}
			);
		}
	};

	$scope.deleteFromCalculations = function(index) {
		$scope.totalCalculation.splice(index, 1);
	};

	$scope.showResult = function() {
		$scope.getPricesAndEquivalent();
		$scope.displayResult();

	};

	$scope.resetAllData = function() {
		$scope.userSelect = false;
		$scope.userData = {};
	};


	$scope.displayResult = function() {
		$scope.getUserInputDisplay();


		var outputTotalLED = 0;
		var outputTotalCFL = 0;
		angular.forEach($scope.totalCalculation, function(index, value) {
			console.log(index.EquivalCFL.CflCost);
			console.log(index.EquivalLED.LedCost);
			outputTotalCFL = outputTotalCFL + index.EquivalCFL.CflCost;
			outputTotalLED = outputTotalLED + index.EquivalLED.LedCost;
		});
		$scope.userData.outputTotalCFLMonthly =  (outputTotalCFL/34.246538).toFixed(2);
		$scope.userData.outputTotalCFLYearly =  (outputTotalCFL/2.8538813).toFixed(2);
		$scope.userData.outputTotalLEDMonthly = (outputTotalLED/34.246538).toFixed(2);
		$scope.userData.outputTotalLEDYearly = (outputTotalLED/2.8538813).toFixed(2);

	}



	$scope.getUserInputDisplay = function() {
		$scope.output = "<h2>Your Selection</h2>You have Selected the Following Bulbs<br>";
		var inputTotal = 0;
		angular.forEach($scope.totalCalculation, function(index, value){
			$scope.output += index['number'] + " " + $scope.allBulbsData[index['bulb']].name + " Bulb " + index['watt'] + " Watt <br/>";
			inputTotal = inputTotal + index['costs'];
		});
		$scope.userData.monthlyCost = (inputTotal/34.246538).toFixed(2);
		$scope.userData.yearlyCost = (inputTotal/2.8538813).toFixed(2);
	}


	$scope.closest = function(arr, num) {
		var curr = arr[0];
		var diff = Math.abs(num - curr);
		for (var val = 0; val < arr.length; val++) {
			var newdiff = Math.abs(num - arr[val]);
			if (newdiff < diff) {
				diff = newdiff;
				curr = arr[val];
			}
		}
		return curr;
	};

	$scope.transform = function (transformed) {
		var realLEDWatt = transformed['watt'] * $scope.allBulbsData[transformed['bulb']].thecon / $scope.allBulbsData[2].thecon;
		var realCFLWatt = transformed['watt'] * $scope.allBulbsData[transformed['bulb']].thecon / $scope.allBulbsData[1].thecon;
		var averageLEDWatt = $scope.closest($scope.allBulbsData[2].watt,realLEDWatt );
		var averageCFLWatt = $scope.closest($scope.allBulbsData[1].watt,realCFLWatt );
		var LedCost = [];
		var CflCost = [];
		LedCost.push(transformed['number'] * averageLEDWatt * 25 * $scope.Prices[$scope.userData.slice].price );
		CflCost.push(transformed['number'] * averageCFLWatt * 25 * $scope.Prices[$scope.userData.slice].price);
		angular.extend(transformed, {realLEDWatt: realLEDWatt, EquivalLED: {averageWatt: averageLEDWatt, LedCost: LedCost}});
		angular.extend(transformed, {realCFLWatt: realCFLWatt, EquivalCFL: {averageWatt: averageCFLWatt, CflCost: CflCost}});
	}

	$scope.getPricesAndEquivalent = function(){
		angular.forEach($scope.totalCalculation,function (index) {
			var cost = index['number'] * index['watt'] * 25 * $scope.Prices[$scope.userData.slice].price;
			$scope.results.push(cost);
			angular.extend(index, {'costs' : cost});
			$scope.transform(index);
		});
		console.log($scope.results);
		console.log($scope.totalCalculation);
	}


















});
