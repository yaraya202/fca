// Test 1: What does module/index export?
const mod1 = require('./includes/fca/module/index');
console.log("1. module/index exports:", typeof mod1, Object.keys(mod1));
console.log("  login property:", typeof mod1.login);

// Test 2: Destructure and re-export
const { login } = mod1;
console.log("2. Destructured login:", typeof login);

// Test 3: What does our index.js export?
delete require.cache[require.resolve('./includes/fca/index')];
const mod2 = require('./includes/fca/index');
console.log("3. Our index.js exports:", typeof mod2, mod2);

// Test 4: Try calling it
if (typeof mod2 === 'function') {
  console.log("4. mod2 is callable as function");
} else if (mod2.login && typeof mod2.login === 'function') {
  console.log("4. mod2.login is callable as function");
} else {
  console.log("4. Nothing is callable!");
}
