require("./typex.js");

var mongo = require('mongodb');

var Inserter = function (collection) {
		this.collection = collection;
		this.data = [];
		this.maxThreads = 30;
		this.currentThreads = 0;
		this.batchSize = 1000;
		this.queue = 0;
		this.inserted = 0;
		this.startTime = Date.now();
};

Inserter.prototype.add = function(data) {
		this.data.push(data);
};

// Use force=true for last insert
Inserter.prototype.insert = function(force) {
		var that = this;
		if (this.data.length >= this.batchSize || force) {
				if (this.currentThreads >= this.maxThreads) {
						this.queue++;
						return;
				}
				this.currentThreads++;
				console.log('Threads: ' + this.currentThreads);
				this.collection.insert(this.data.splice(0, this.batchSize), {safe:true}, function() {
						that.inserted += that.batchSize;
						var currentTime = Date.now();
						var workTime = Math.round((currentTime - that.startTime) / 1000)
						console.log('Speed: ' + that.inserted / workTime + ' per sec');
						that.currentThreads--;
						if (that.queue > 0) {
								that.queue--;
								that.insert();
						}
				});
		}
};

ngram = function(str,n) {
	//http://norvig.com/mayzner.html
	var ngrams = [[],[],
								["th","he","in","er","an"], // 2grams
								["the","and","ing","ion","tio"] // 3grams
							 ];
	
	var total = 0;
	for (var i in ngrams[n]) {
		var re = new RegExp(ngrams[n][i], 'gi');
		if((didMatch = str.match(re))) {
			total += didMatch.length;
		}
	}
	return total;
	
};
	 
var db = new mongo.Db('test', new mongo.Server('localhost', 27017, {w:1}), {native_parser:false});

db.open(function(err, db) {
		db.collection('typexResults', function(err, collection) {
			
			var inserter = new Inserter(collection);
			var cipher_text = 'HVPKDFNFJWYIDDCRQXSRDJHFPGOVFNMIAPXPABUZWYYNPCMPNWHJRZHNLXKGMEMKKONOIBAKEEQWAOTARBQRHDJOFMTPZEHLKXGHRGGHTJRZCQFNKTQKLDTSFQIRW';
			var indicator = 'AOAKN';
			x = 0;

			//Rotor orientations (5^2)
			for (r1 = 0; r1 <= 1; r1++) {
			for (r2 = 0; r2 <= 1; r2++) {
			for (r3 = 0; r3 <= 1; r3++) {
			for (r4 = 0; r4 <= 1; r4++) {
			for (r5 = 0; r5 <= 1; r5++) {
					
			//Rotor positions (5^7)
			for (a = 0; a <=7; a++) {
			for (b = 0; b <=7; b++) {
			for (c = 0; c <=7; c++) {
			for (d = 0; d <=7; d++) {
			for (e = 0; e <=7; e++) {

				rotorPos = a.toString() + b + c + d + e;
				rotorOri = r1.toString() + r2 + r3 + r4 + r5;

				if((/(\d)(?=.*\1)/).test(rotorPos)) continue;

				var ct_val = TypeX.init(rotorPos, rotorOri, indicator, cipher_text);
									 
				inserter.add({
					c_text: ct_val,
					two_gram: ngram(ct_val,2),
					three_gram: ngram(ct_val,3),
					rotor_position: rotorPos,
					rotor_orientation: rotorOri
				});

				if(x%5000===0) {
					inserter.insert();
				}

				x++;

			}
			}
			}
			}
			}

			}
			}
			}
			}
			}

			//Final batch insert
			inserter.insert(true);

		});
});