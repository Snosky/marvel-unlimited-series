## Add comics series to your library
```
GET https://www.marvel.com/comics/show_more
```
Parameters :
  * `tpl: ../partials/comic_issue/comics_singlerow_item.mtpl` Mandatory !
  * `orderBy: release date+asc`
  * `isDigital: 1` To get only Marvel Unlimited comics
  * `offset: 0`
  * `byType: comic_series` 
  * `byId: 466` Id of the comic serie
  * `limit: 18`
  * `count: 20`

It return HTML code with link to comics, here is the regex to get comics IDs
`www\.marvel\.com\/comics\/issue\/([0-9]*)`

### Add to library
```
POST https://www.marvel.com/my_account/my_must_reads
````
Parameters :
  * `ID` Comic's ID extracted from regex
  
### Remove from library
```
DELETE /my_account/my_must_reads/issues/:comic_id
```
