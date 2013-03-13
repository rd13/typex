# TypeX Emulator

This is a Javascript implementation of the British Rotor Cipher Machine - [TypeX][2].

##### Example 1 - Enciphering
```javascript
var demo1 = TypeX.init('01234', '00100', 'AOAKN', 'This is the string to be encoded');
//demo1 == KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY
```

##### Example 2 - Deciphering
```javascript
var demo2 = TypeX.init('01234', '00100', 'AOAKN', 'KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY');
//demo2 == THISXISXTHEXSTRINGXTOXBEXENCODED
```

##### Brute Force Decipher

The code in brute_force.js loops through every possible rotor position and orientation. It then inserts (in batches) the results into a Mongo collection.

To run this Javascript you will need Node with the [native Mongo module][3] installed.

```javascript
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

//Continue if rotor positions are not unique
if((/(\d)(?=.*\1)/).test(rotorPos)) continue;

var cipher_text = TypeX.init(rotorPos, rotorOri, 'AOAKN', 'KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY');
```

The brute force method assumes that we know the indicator key.

In the above example, there are 215,000 possible rotor settings, after inserting them into our Mongo collection we can then reduce them by searching for cribs or by ordering them by their common bigram / trigram count.

[1]: http://scholarworks.sjsu.edu/cgi/viewcontent.cgi?article=1244&context=etd_projects
[2]: http://en.wikipedia.org/wiki/Typex
[3]: https://github.com/mongodb/node-mongodb-native