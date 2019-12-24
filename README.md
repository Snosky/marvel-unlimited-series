# Marvel Unlimited Series
`Marvel Unlimited Series` is a Google Chrome and Brave extension (soon on Firefox) that add a button on Marvel series pages who allow you to add the whole series (only issues available with Marvel Unlimited) to your Marvel Unlimited library.

You must be subscribed to Marvel Unlimited.
## How does it work
First we fetch the list of issues from this URL `https://www.marvel.com/comics/show_more` with these parameters :
 * `offset=0`
 * `tpl=..%2Fpartials%2Fcomic_issue%2Fcomics_singlerow_item.mtpl` Mandatory !
 * `byType=comic_series` Needed to filter by comic series ID
 * `limit=100`
 * `isDigital=1` Only get Marvel Unlimited
 * `byId=1` Comic series' ID

It return HTML that we parse to get IDs of comic issues.
Then with those IDs we send a POST request to `https://www.marvel.com/my_account/my_must_reads` with these parameters:
 * `ID` Comic issue ID

And BOOM, it's added to your library

PS: If someone want to correct my english, please do it :)
