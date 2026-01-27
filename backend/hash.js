const bcrypt = require('bcrypt');
(async () => {
  console.log(await bcrypt.hash('admin123', 10));
})();
