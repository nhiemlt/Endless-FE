const moment  = require("moment");

module.exports = Object.freeze({
    CALENDAR_INITIAL_EVENTS : [
        {title : "Cuộc gọi sản phẩm", theme : "GREEN", startTime : moment().add(-12, 'd').startOf('day'), endTime : moment().add(-12, 'd').endOf('day')},
        {title : "Họp với đội kỹ thuật", theme : "PINK", startTime : moment().add(-8, 'd').startOf('day'), endTime : moment().add(-8, 'd').endOf('day')},
        {title : "Họp với Linh", theme : "PURPLE", startTime : moment().add(-2, 'd').startOf('day'), endTime : moment().add(-2, 'd').endOf('day')},
        {title : "Họp với Phong", theme : "BLUE", startTime : moment().startOf('day'), endTime : moment().endOf('day')}, 
        {title : "Cuộc gọi sản phẩm", theme : "GREEN", startTime : moment().startOf('day'), endTime : moment().endOf('day')},
        {title : "Họp khách hàng", theme : "PURPLE", startTime : moment().startOf('day'), endTime : moment().endOf('day')},
        {title : "Họp khách hàng", theme : "ORANGE", startTime : moment().add(3, 'd').startOf('day'), endTime : moment().add(3, 'd').endOf('day')},
        {title : "Họp sản phẩm", theme : "PINK", startTime : moment().add(5, 'd').startOf('day'), endTime : moment().add(5, 'd').endOf('day')},
        {title : "Họp bán hàng", theme : "GREEN", startTime : moment().add(8, 'd').startOf('day'), endTime : moment().add(8, 'd').endOf('day')},
        {title : "Họp sản phẩm", theme : "ORANGE", startTime : moment().add(8, 'd').startOf('day'), endTime : moment().add(8, 'd').endOf('day')},
        {title : "Họp marketing", theme : "PINK", startTime : moment().add(8, 'd').startOf('day'), endTime : moment().add(8, 'd').endOf('day')},
        {title : "Họp khách hàng", theme : "GREEN", startTime : moment().add(8, 'd').startOf('day'), endTime : moment().add(8, 'd').endOf('day')},
        {title : "Họp bán hàng", theme : "BLUE", startTime : moment().add(12, 'd').startOf('day'), endTime : moment().add(12, 'd').endOf('day')},
        {title : "Họp khách hàng", theme : "PURPLE", startTime : moment().add(16, 'd').startOf('day'), endTime : moment().add(16, 'd').endOf('day')},
    ],

    RECENT_TRANSACTIONS : [
        {name : "Phong", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "phong@dashwind.com", location : "Hà Nội", amount : 100, date : moment().endOf('day')},
        {name : "Trang", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "trang@dashwind.com", location : "Đà Nẵng", amount : 190, date : moment().add(-1, 'd').endOf('day')},
        {name : "Hưng", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "hung@dashwind.com", location : "Hồ Chí Minh", amount : 112, date : moment().add(-1, 'd').endOf('day')},
        {name : "Tú", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "tu@dashwind.com", location : "Cần Thơ", amount : 111, date : moment().add(-1, 'd').endOf('day')},
        {name : "Minh", avatar : "https://reqres.in/img/faces/5-image.jpg", email : "minh@dashwind.com", location : "Hà Nội", amount : 190, date : moment().add(-2, 'd').endOf('day')},
        {name : "Mai", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "mai@dashwind.com", location : "Đà Nẵng", amount : 230, date : moment().add(-2, 'd').endOf('day')},
        {name : "Linh", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "linh@dashwind.com", location : "Hồ Chí Minh", amount : 331, date : moment().add(-2, 'd').endOf('day')},
        {name : "Tuấn", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "tuan@dashwind.com", location : "Hà Nội", amount : 581, date : moment().add(-2, 'd').endOf('day')},
        {name : "Hoa", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "hoa@dashwind.com", location : "Huế", amount : 151, date : moment().add(-2, 'd').endOf('day')},
        {name : "Bình", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "binh@dashwind.com", location : "Hà Nội", amount : 91, date : moment().add(-2, 'd').endOf('day')},
        {name : "Hà", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "ha@dashwind.com", location : "Huế", amount : 161, date : moment().add(-3, 'd').endOf('day')},
        {name : "Khánh", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "khanh@dashwind.com", location : "TP.HCM", amount : 121, date : moment().add(-3, 'd').endOf('day')},
        {name : "Lan", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "lan@dashwind.com", location : "Đà Nẵng", amount : 713, date : moment().add(-3, 'd').endOf('day')},
        {name : "Dũng", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "dung@dashwind.com", location : "Hà Nội", amount : 217, date : moment().add(-3, 'd').endOf('day')},
        {name : "Minh", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "minh@dashwind.com", location : "Hà Nội", amount : 117, date : moment().add(-3, 'd').endOf('day')},
        {name : "Bảo", avatar : "https://reqres.in/img/faces/7-image.jpg", email : "bao@dashwind.com", location : "Hồ Chí Minh", amount : 612, date : moment().add(-3, 'd').endOf('day')},
        {name : "Phát", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "phat@dashwind.com", location : "Hà Nội", amount : 631, date : moment().add(-3, 'd').endOf('day')},
        {name : "Ngọc", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "ngoc@dashwind.com", location : "Đà Nẵng", amount : 151, date : moment().add(-3, 'd').endOf('day')},
        {name : "Vy", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "vy@dashwind.com", location : "Hà Nội", amount : 617, date : moment().add(-3, 'd').endOf('day')},
    ]
});
