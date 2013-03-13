 ==================
| TypeX Emulation |
 ==================

This is a Javascript implementation of the British Cipher Machine - TypeX. I have translated this to Javascript from a [version written in C][1].

Improvements that I have made to the original code include:

1. It no longer uses files for input / output.
2. I have broken down the transformation into a better (more readable) format:

The transformation steps are: 

* Input -> 
* Right Stator ->
* Left Stator -> 
* Right Rotor -> 
* Middle Rotor -> 
* Left Rotor -> 
* Reflector -> 
* Left Rotor -> 
* Middle Rotor -> 
* Right Rotor -> 
* Left Stator -> 
* Right Stator -> 
* Output

3. I wrote this with the intention of using it in a brute force attack. To do this we can iterate through all possible rotor settings / orientations. Please see brute_force.js for an example.

4. Input validation has been modularised.

5. Removed goto's, general housekeeping.

##### Example 1 - Encoding
```javascript
var demo1 = TypeX.init('01234', '00100', 'AOAKN', 'This is the string to be encoded');
console.log(demo1);
//demo1 == KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY
```

##### Example 2 - Decoding
```javascript
var demo2 = TypeX.init('01234', '00100', 'AOAKN', 'KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY');
console.log(demo2);
//demo2 == THISXISXTHEXSTRINGXTOXBEXENCODED
```

##### Brute Force

The code in brute_force.js loops through every possible rotor position and orientation. This assumes that we know the indicator key.

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

In the above example, there are 215,000 possible rotor settings, of which we can harvest them into a database. We can then crawl this database and search for cribs, or we can perform a common bigram / trigram count which is probably an easier way to reduce this number.

See function ngram(str, n) in brute_force.js for an example of how to add these counts to your database.

[1]: http://scholarworks.sjsu.edu/cgi/viewcontent.cgi?article=1244&context=etd_projects