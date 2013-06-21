# Typex Simulator

This is a Javascript implementation of the British Rotor Cipher Machine - [Typex][2].

TypeX.init() accepts 4 arguments:

1. Which rotors to use.
2. The orientation of the rotors. 1 = reversed.
3. The indicator key (the starting position for each rotor)
4. Text to encipher / decipher

Unfortunately the actual rotor wirings of the Typex have never been disclosed or recovered. So the wirings used in this example are that of the [Enigma][2].

##### Usage instructions

Either run from the command line with Node, or there is an example interface in example/index.html. Just open this file in your browser.

###### Enciphering
```javascript
TypeX.init('01234', '00100', 'AOAKN', 'This is the string to be encoded');
// Output: KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY
```

###### Deciphering
```javascript
TypeX.init('01234', '00100', 'AOAKN', 'KLHESNYNIMQAZHIZROBHDZHKWRQFFRTY');
// Output: THISXISXTHEXSTRINGXTOXBEXENCODED
```

[1]: http://en.wikipedia.org/wiki/Enigma_rotor_details
[2]: http://en.wikipedia.org/wiki/Typex