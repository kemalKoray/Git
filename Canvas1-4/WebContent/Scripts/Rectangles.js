var xmlhttp = new XMLHttpRequest();
var url = "Datas/datas.txt";
var recArr;
var gap = 10;
var heightCanvas = 700;
var height = 100;
var width = 100;
var slide = 0;
var yStart;
var check;
var rec = new Array();
var column= new Array();

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        recArr = JSON.parse(xmlhttp.responseText);
    }
   
    var canvas = oCanvas.create({
    	canvas: "#canvas"
    });
    
    column[0] = new Array;
    column[0].push(recArr[0]);
    
    function createColumn(){
    	for(i=1; ; i++){   	 	
    		if(column[i-1].length == 0)
    			break;
    		column[i] = new Array();   	
    		for(j=0; j<column[i-1].length; j++){
    			for(k=0; k<column[i-1][j].childs.length; k++){
    				l = 0;
    				while(column[i-1][j].childs[k] != recArr[l].name)
    					l++;
    				check = true;
    				for(m=0; m<column[i].length; m++)
    					if(recArr[l] == column[i][m]){
    						check = false
    					}
    				if(check == true)
    					column[i].push(recArr[l]);
        		}  		
    	}
    }
    }

    function setCanvasPoints(){
    	for(i=0; i<column.length-1; i++){
    		area = (height * column[i].length) + ((column[i].length -1) * gap);
    		yStart = (heightCanvas/2) - (area/2);
    		for(j=0; j<column[i].length; j++){ 
    			column[i][j].x = slide;
    			column[i][j].y = yStart;
    			yStart += height + gap;
    		}
    		slide += 200;
    		gap += 20;
    	}
    }
    
    function createRectangles(){
    	for(i=0; i<column.length-1; i++){
    		for(j=0; j<column[i].length; j++){ 
    			column[i][j].rec = canvas.display.rectangle({
    				x: column[i][j].x,
    				y: column[i][j].y,
    				width: 100,
    				height: 100,
    				fill: "#0cc"
    			});   
    			column[i][j].text = canvas.display.text({
    				x: column[i][j].x + 20,
    				y: column[i][j].y + 40,
    				origin: { x: "center", y: "top" },
    				text:  column[i][j].name,
    				fill: "#000"
    			});
    			
    			column[i][j].isDisplayed = false;
    			
    		}
    	}
    }
    
    function createLinks(){
    	for(i=0; i<column.length-1; i++){
    		for(j=0; j<column[i].length; j++){ 
    			column[i][j].link = new Array();
    			for(k=0; k<column[i][j].childs.length; k++){
    				l = 0;
    				while(column[i][j].childs[k] != column[i+1][l].name)
    					l++;
    				column[i][j].link[k] = canvas.display.line({
    					start: { x: column[i][j].x + width/2 , 
    					     y: column[i][j].y + height/2},
    					     end: { x: column[i+1][l].x + width/2, 
    					   y: column[i+1][l].y + height/2},
    					   stroke: "2px #0aa",
    					   cap: "round"
    				});
    			}
    		}
    	}
    }
    
    function show(){
    	canvas.addChild(column[0][0].rec);
    	canvas.addChild(column[0][0].text);
    	
    	for(i=0; i<column.length-2; i++){
    		for(j=0; j<column[i].length; j++){ 		
    			column[i][j].rec.bind("click tap", function (valI,valJ) { return function(){
    	    		for(k=0; k<column[valI][valJ].childs.length; k++){
    	    			canvas.addChild(column[valI][valJ].link[k]); 
        				l = 0;
        				while(column[valI][valJ].childs[k] != column[valI+1][l].name)
        					l++;
        				if(column[valI+1][l].isDisplayed == true){
        					canvas.removeChild(column[valI+1][l].rec);
            				canvas.removeChild(column[valI+1][l].text);
        				}
        				canvas.addChild(column[valI+1][l].rec);
        				canvas.addChild(column[valI+1][l].text);
        				column[valI+1][l].isDisplayed = true;
        				
    	    		}
    	    		canvas.removeChild(column[valI][valJ].rec);
    				canvas.removeChild(column[valI][valJ].text);
    	    		canvas.addChild(column[valI][valJ].rec);
    				canvas.addChild(column[valI][valJ].text);   				
    	    		}
    				
    	    	}(i,j));
    		}
    		
    	}
    	
    }
    
	createColumn();
	setCanvasPoints();
	createRectangles();
	createLinks();
	show();
}

xmlhttp.open("GET", url, true);
xmlhttp.send();