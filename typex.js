String.prototype.letterIndex = function(){
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(this[0]);
};

TypeX = (function() {

  var rotor_init = [  "QWECYJIBFKMLTVZPOHUDGNRSXA",
                      "AJDKSIRUXBLHWTMCQGZNPYFVOE",
                      "BDFHJLCPRTXVZNYEIWGAKMUSQO",
                      "ESOVPZJAYQUIRHXLNFTGKDCMWB",
                      "VZBRGITYUPSDNHLXAWMJQOFECK",
                      "FVPJIAOYEDRZXWGCTKUQSBNMHL",
                      "KZGLIUCJEHADXRYWVTNSFQPMOB",
                      "ZLVGOIFTYWUEPMABNCXRQSDKHJ"],
    reflector_init = "YRUHQSLDPXNGOKMIEBFZCWVJAT",
    step_init = "ACEINQTVY";

    var RS = [] //Right Stator
      , LS = [] //Left Stator
      ,  R = [] //Right Rotor
      ,  M = [] //Middle Rotor
      ,  L = [] //Left Rotor
      ,  L_inv = [] //Inverse Left Rotor
      ,  M_inv = [] //Inverse Middle Rotor
      ,  R_inv = [] //Inverse Right Rotor
      , LS_inv = [] //Inverse Left Stator
      , RS_inv = []; //Inverse Right Stator

     var ort = []
       , notch = [];

    this.init = function(pos, ori, rot, str) {

    if((err = validateInput(pos, ori, rot, str)).length === 0) {
        //Input is valid

        //Remove multiple spaces
        plain_text = str.replace( / +/g, ' ' ).toUpperCase();

        //Replace spaces with X
        plain_text = str.replace( / /g, 'X' ).toUpperCase();

        ort = ori.split('');

        initRotors(pos[0], pos[1], pos[2], pos[3], pos[4]);

        rot = rot.toUpperCase();

        return simulator(rot[0], rot[1], rot[2], rot[3], rot[4]);

    } else {
      //Input is invalid
      console.log(err);
    }

  }

  this.validateInput = function(pos, ori, rot, str) {
        var err = [];
        //Rotor orientation must be 0-1 (1=reversed), 5 in length
        if(!(/^[0-1]{5}$/).test(ori))
            err.push({text:'Orientation must be 0-1 (1=reversed), and configured for 5 rotors.', val:ori});

        //Rotors most be from 1-8, 5 in length
        if(!(/^[0-7]{5}$/).test(pos))
            err.push({text:'Selected rotors must be 0-7, and 5 rotors must be chosen.', val:pos});

        //Rotors must be unique
        if((/(\d)(?=.*\1)/).test(pos))
            err.push({text:'Rotors must be unique.', val:pos});

        //Rotor init positions must be alphabetical, 5 in length
        if(!(/^[A-Z]{5}$/i).test(rot))
            err.push({text:'Rotor init positions must be A-Z, and configured for 5 rotors.', val:rot});

        //Input string must be alphabetical, spaces are OK
        if(!(/^[A-Z ]+$/i).test(str))
            err.push({text:'Input string must be A-Z, spaces are OK', val:str});

    return err;
  }

  this.initRotors = function(numL, numM, numR, numLS, numRS) {

      var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (i = 0; i < 26; ++i) {
          Lrotor = rotor_init[numL];
          Mrotor = rotor_init[numM];
          Rrotor = rotor_init[numR];
          Lstator = rotor_init[numLS];
          Rstator = rotor_init[numRS];
          reflector = reflector_init;
      }

      L[0] = Lrotor;
      M[0] = Mrotor;
      R[0] = Rrotor;
      LS[0] = Lstator;
      RS[0] = Rstator;

      // sets permutation for all other letters
      for (i = 1; i < 26; ++i) {
        L[i] = [];
        M[i] = [];
        R[i] = [];
        LS[i] = [];
        RS[i] = [];
        for (j = 0; j < 26; ++j) {
            L[i][j] = letter[((Lrotor[(i + j) % 26].letterIndex() + 26 - i) % 26)];
            M[i][j] = letter[((Mrotor[(i + j) % 26].letterIndex() + 26 - i) % 26)];
            R[i][j] = letter[((Rrotor[(i + j) % 26].letterIndex() + 26 - i) % 26)];
            LS[i][j] = letter[((Lstator[(i + j) % 26].letterIndex() + 26 - i) % 26)];
            RS[i][j] = letter[((Rstator[(i + j) % 26].letterIndex() + 26 - i) % 26)];
        }
      }

      //Reverse rotors
      for (i = 0; i < 5; ++i) {
          if (ort[i] == 1) {
              reverse(i);
          }
      }

      // find inverse permutation
      for (i = 0; i < 26; ++i) {
        L_inv[i] = [];
        M_inv[i] = [];
        R_inv[i] = [];
        LS_inv[i] = [];
        RS_inv[i] = [];
        for (j = 0; j < 26; ++j) {
          L_inv[i][L[i][j].letterIndex()] = letter[j];
          M_inv[i][M[i][j].letterIndex()] = letter[j];
          R_inv[i][R[i][j].letterIndex()] = letter[j];
          LS_inv[i][LS[i][j].letterIndex()] = letter[j];
          RS_inv[i][RS[i][j].letterIndex()] = letter[j];
        }
      }

    //Initialize notches
    for (i = 0; i < 9; ++i) {
        notch[i] = step_init[i].letterIndex();
    }
  }


  /*
  ======================================================================

      Toggle rotor / stator orientation

  ======================================================================
  */
  this.reverse = function(x) {
      var i, j;
      var newrotor = [];

      for (i = 0; i < 26; i++) {
          newrotor[i] = [];
      }

      // reverse Left rotor
      if (x == 0) {
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  newrotor[i][j] = L[i][(26 - j) % 26];
              }
          }
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  L[i][j] = newrotor[i][j];
              }
          }
      }
      // reverse Middle rotor
      if (x == 1) {
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  newrotor[i][j] = M[i][(26 - j) % 26];
              }
          }
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  M[i][j] = newrotor[i][j];
              }
          }
      }
      // reverse Right rotor
      if (x == 2) {
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  newrotor[i][j] = R[i][(26 - j) % 26];
              }
          }
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  R[i][j] = newrotor[i][j];
              }
          }
      }
      // reverse Left Stator
      if (x == 3) {
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  newrotor[i][j] = LS[i][(26 - j) % 26];
              }
          }
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  LS[i][j] = newrotor[i][j];
              }
          }
      }
      // reverse Right Stator
      if (x == 4) {
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  newrotor[i][j] = RS[i][(26 - j) % 26];
              }
          }
          for (i = 0; i < 26; ++i) {
              for (j = 0; j < 26; ++j) {
                  RS[i][j] = newrotor[i][j];
              }
          }
      }

  }

  this.simulator = function (init_L, init_M, init_R, init_LS, init_RS) {

      var outChar = '',
          ct_text = plain_text.split(''),
          cur_L = init_L.letterIndex(),
          cur_M = init_M.letterIndex(),
          cur_R = init_R.letterIndex(),
          stepR = 0,
          stepM = 0,
          stepL = 0;

      for (i in ct_text) {

          ct_letter = ct_text[i];

          // encryption/decryption and stepping part

          for (i = 0; i < 9; ++i) {
              // all 3 step (step left and middle here)
              if (cur_M == notch[i]) {
                  if (ort[0] == 1) {
                      cur_L = stepRotor(cur_L, 26, 1);
                  } else {
                      cur_L = stepRotor(cur_L, 26, 0);
                  }
                  if (ort[1] == 1) {
                      cur_M = stepRotor(cur_M, 26, 1);
                  } else {
                      cur_M = stepRotor(cur_M, 26, 0);
                  }
                  stepL++;
                  stepM++;
              } else {
                  // M and R both step (step middle here)
                  if (cur_R == notch[i]) {
                      if (ort[1] == 1) {
                          cur_M = stepRotor(cur_M, 26, 1);
                      } else {
                          cur_M = stepRotor(cur_M, 26, 0);
                      }
                      stepM++;
                  }
              }
          }
          // step right (fast) rotor --- always steps

          if (ort[2] == 1) {
              cur_R = stepRotor(cur_R, 26, 1);
          } else {
              cur_R = stepRotor(cur_R, 26, 0);
          }
          stepR++;

          //Preform TypeX transformation
          //Input -> RS -> LS -> R -> M -> L -> Reflector -> L -> M -> R -> LS -> RS -> Output

          //Pass through stators
          RS_char = RS[init_RS.letterIndex()][ct_letter.letterIndex()];
          LS_char = LS[init_LS.letterIndex()][RS_char.letterIndex()];

          //Pass through rotors
          R_char = R[cur_R][LS_char.letterIndex()];
          M_char = M[cur_M][R_char.letterIndex()];
          L_char = L[cur_L][M_char.letterIndex()];

          //Pass through reflector
          Reflector_char = reflector[L_char.letterIndex()];

          //Pass back through rotors
          L_inv_char = L_inv[cur_L][Reflector_char.letterIndex()];
          M_inv_char = M_inv[cur_M][L_inv_char.letterIndex()];
          R_inv_char = R_inv[cur_R][M_inv_char.letterIndex()];

          //Pass back through stators
          LS_inv_char = LS_inv[init_LS.letterIndex()][R_inv_char.letterIndex()];
          RS_inv_char = RS_inv[init_RS.letterIndex()][LS_inv_char.letterIndex()];

          outChar += RS_inv_char;

      }

     return outChar;

  }


  /*
  ======================================================================

      Step forward / backward rotor position

  ======================================================================
  */
  this.stepRotor = function(pos, n, rev) {
      var t;
      if (rev == 1) {
      t = pos - 1;
      if (t < 0) {
          t = 25;
      }
    } else {
      t = pos + 1;
      if (t >= n) {
          t = 0;
      }
      }
      return (t);
  }

    return this;
})();