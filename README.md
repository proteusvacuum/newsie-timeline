newsie-timeline
====================
A javascript/jquery timeline with google docs.
-----------------

An example can be found [here](http://timeline.faridrener.com)
A sample dataset can be found [here](https://docs.google.com/spreadsheet/ccc?key=0Ag-BlnbZq4DXdG9YM1hnY3lsNXlZYW9UTnF4Y1dRdEE#gid=0)

1. Prepare your data:

Create your google spreadsheet with column names:
- Date 
- Time
- Title
- Text
- MediaURL
- MediaCredit

Date must be in dd/mm/yyyy or mm/dd/yyyy
Time must be hh:mm:ss
Title and Text are exactly what they sound like. You can add html in these fields. 
MediaURL: the URL of an image (only images supported for now)
MediaCredit: Where the image comes from (e.g. "Platon")

Publish the spreadsheet by going to File->Publish to the web... make sure to check "automatically republish when changes are made"

Make the spreadhseet publicly viewable (Share->Change...->Public)
Copy and paste the 'key': In the URL bar find where it says "key=" and copy the letters and numbers up to and not including the #

Get the timeline on your page:
------------------------------
newsie-timeline has a few dependencies:
- [jQuery](http://jquery.com/)
- [Miso](http://misoproject.com/)
- [ImagesLoaded](https://github.com/desandro/imagesloaded)
- [jQueryStickem](https://github.com/davist11/jQuery-Stickem)
	They are included in the src folder of this repo. 
	Add them to your page with the following in your header, or however else you prefer to add scripts.
	`<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
		<script src="src/jquery.stickem.min.js"></script>
		<script src="src/miso.ds.deps.ie.min.0.4.0.js"></script>
		<script src="src/imagesloaded.pkgd.min.js"></script>`

Then add newsie-timeline.js and its stylesheet - newsie-timeline.css
	`<script src="src/newsie-timeline.min.js"></script>`
	`<link rel="stylesheet" href="css/newsie-timeline.css">`
In the place you want the timeline to be add the following div, replacing GOOGLE-DRIVE-SPREADSHEET-KEY with the key you copied in step 1. 
`<div id="newsie-timeline-container" gsKey="GOOGLE-DRIVE-SPREADSHEET-KEY"></div>`

Refresh your page! That should be it! You can style the timeline as you wish with the css. 