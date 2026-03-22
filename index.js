const express = require("express");
// nhúng file dùng require
require("dotenv").config();

const route = require("./routes/client/index_route");

const routeAdmin = require("./routes/admin/index_route");

const database = require("./config/database");

const systemConfig = require("./config/system");

const methodOverride = require('method-override');

const bodyParser = require('body-parser');

const flash = require('express-flash');

const cookieParser = require("cookie-parser");

const session = require("express-session");

const path = require('path');



const app = express();

database.connect();
const port = process.env.PORT;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// sử dụng thư viện method-override để có thể giả lập các phương thức PUT, PATCH, DELETE trong form
app.use(methodOverride('_method'));

// sử dụng thư viện body-parse để có thể lấy giá trị tham số động url
app.use(bodyParser.urlencoded());

// sử dụng thư viện express-flash để hiển thị thông báo
app.use(cookieParser('key tự tạo để bảo mật'));
app.use(session({
  cookie: {
    maxAge: 60000 // thời gian cho cookie
  }
}));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin; // tạo ra biến toàn cục sử dụng được trong tất cả các file pug

app.use(express.static(`${__dirname}/public`)); // để hiểu file public khi đưa lên online

// routes
route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`Hãy truy cập vào link: http://localhost:${port}`)
})