# 537GreenCorp
Communication Using JSON

Hey guys, feel free to add things, and give yourself credit at the top if you contribute to it
and ideally a comment of whatever functionality as well as your name there if you'd like to keep track of who did what faster


####Instructions:

###[POST] /api/global
should contain an array of json objects in following format  
(check <strong>/api/global/test</strong> for an example)

<pre>
[  
 {  
  "x":12,                 // coordinates must be Integers, not String  
  "y":14,                 // ALL CAPS as in enums folder  
  "terrain": "SAND",      // ROCK, SOIL, GRAVEL, SAND, FLUID, NONE  
  "science": "CRYSTAL",   // RADIACTIVE, ORGANIC, MINERAL, ARTIFACT, CRYSTAL, NONE  
 }, ...  
]  
</pre>

###[GET] /api/global
Returns the global map in json array.  Please minimize the usage to reduce traffic

###[GET] /api/global/reset
Erases the data. Can be used when game restarts

###[GET] /api/global/size
Shows the size of the global map array

###[GET] /api/global/test
An example

If you are Green Corp, attach your name here and feel free to contribute! <em>(contact group 11 for access)  
Contributors: Peter Rodriguez, Seung Kim
