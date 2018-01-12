const banners=`
create table if not exists banners(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    content VARCHAR(100) NOT NULL,
    url VARCHAR(100) NOT NULL,
    pic VARCHAR(100) NOT NULL,
    online VARCHAR(100) NOT NULL,
    moment VARCHAR(100) NOT NULL,
    PRIMARY KEY ( id )
);`
module.exports=banners;
