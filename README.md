# crawling-backend
backend of crawling



Live at frontnend: https://join-us-8fa0c.web.app

Video link https://drive.google.com/file/d/1nbDjzFD8SO645qgB7Trfdzem4ffzA97r/view?usp=sharing

 used
 language:Node js,
 Database :MongoDb,
 library for crawling:(request) to send request,(cherrio) for parsiong html

functionality:
 /:'home',
 /api/v1/mostSearched:'it will return you the all searched tag sorted by number of time it is searched'
 /api/v1/searchByTag/:tagName:'it will return you the recent serached tags here i am using date so that' 
 								'i fetch the recent one so it will go there and fetch it  and then show us',
/api/v1/content:'it will show you the complete post of that '	 							

Point to note
 Here i have tried to make page dynamic instead of static so idea of storing all search result in db is not good because it 
 is dunamic going to change very rapidly

 For fetching most recent post i have used dates so basically it use to fetch post w.r.t to date 
