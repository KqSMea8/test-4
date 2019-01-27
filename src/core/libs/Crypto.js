import createHash from "create-hash";
import {pbkdf2Sync} from "pbkdf2";

function stringToBytes(str) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

export default function getSafePass(pwd) {
  let charIndex = pwd.length % 6, sum = pwd.charCodeAt(charIndex) % 3,
      halfPass = pwd.split('').reduce((a, b, index) => index%3 !== sum && (a+=b) || a, '') + pwd.charAt(charIndex),
      salt = createHash("sha1").update(stringToBytes(halfPass)).digest();
  return pbkdf2Sync(pwd, salt, 1005, 32, "sha1").toString("base64");
}
