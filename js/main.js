var raw = '',parsedData={};
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
        raw = xmlhttp.responseText;
    }
};
xmlhttp.open("GET", "data.json", false);


xmlhttp.send();


window.onload = function(){
	var data = JSON.parse(raw),
			   mainPhotoWrapper = document.createElement('section'),
			   smallPhotoContainer = document.createElement('section'),
			   formContainer = document.createElement('section'),
			   togglerLeft = document.createElement('button'),
			   togglerRight = document.createElement('button'),
			   smallPhotoWrapper = document.createElement('div'),
			   imgWrapper = document.createElement('figure'),
			   imgTitle = document.createElement('figcaption'),
			   form = document.createElement('form'),
			   formLabel = document.createElement('h2'),
			   input = document.createElement('input'),
			   input1 = document.createElement('input'),
			   addButt = document.createElement('button'),
			   removeButt = document.createElement('button'),
			   mainImg = document.createElement('img'),
			   body = document.getElementsByTagName("body")[0],
			   i = 0,
			   counter = 0;

	var createDom = function(){
		mainPhotoWrapper.id = "main-photo-wrapper";
		smallPhotoContainer.id = "small-photo-container";
		formContainer.id = "form-container";
		togglerLeft.classList.add("toggler","left");
		togglerRight.classList.add("toggler","right");
		formLabel.id = "form-label";
		removeButt.id = "remove-butt";
		input.type = "text";
		input.placeholder = "title..."
		input1.type = "text";
		input1.placeholder = "url...";
		mainImg.id = "main-img",
		imgTitle.id = "img-title";
		imgWrapper.id = "img-wrapper";
		addButt.id = "add-butt";
		addButt.type = "button";
		
		formLabel.innerHTML = "Add image";
		removeButt.innerHTML = "Remove";	
		addButt.innerHTML = "Add";

		mainImg.src = data[0].url;
		mainImg.alt = data[0].title;
		imgTitle.innerHTML = data[0].title;
		imgWrapper.appendChild(mainImg);
		imgWrapper.appendChild(imgTitle);
		mainPhotoWrapper.appendChild(togglerLeft);
		mainPhotoWrapper.appendChild(togglerRight);
		mainPhotoWrapper.appendChild(imgWrapper);

		form.appendChild(formLabel);
		form.appendChild(input);
		form.appendChild(input1);
		form.appendChild(addButt);

		formContainer.appendChild(form);
		formContainer.appendChild(removeButt);

		body.appendChild(mainPhotoWrapper);
		body.appendChild(smallPhotoContainer);
		body.appendChild(formContainer);

	}();
	window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024*1024*1024*1024, initFs, errorHandler);

	var createList = function(){
		
		for (i = 0; i < data.length; i++){

			var smallPhotoWrapper = document.createElement('div'),
				img = document.createElement('img');

				smallPhotoWrapper.className = "small-photo-wrapper";

				img.src = data[i].url;
				img.alt = data[i].title;

				smallPhotoWrapper.appendChild(img);
				smallPhotoContainer.appendChild(smallPhotoWrapper);
		}
		document.getElementsByClassName('small-photo-wrapper')[0].classList.add('active');
	}();

	function addListItem(){
		var objClasses = document.getElementsByClassName('small-photo-wrapper');
		console.log(parsedData.length-1);
		var smallPhotoWrapper = document.createElement('div'),
			img = document.createElement('img');

			smallPhotoWrapper.className = "small-photo-wrapper";

			img.src = parsedData[parsedData.length-1].url;
			img.alt = parsedData[parsedData.length-1].title;

			smallPhotoWrapper.appendChild(img);
			smallPhotoContainer.appendChild(smallPhotoWrapper);
			clearActiveClasses();
			changeMainImg(parsedData[parsedData.length-1]);
			
			smallPhotoWrapper.classList.add('active');
			counter = -(parsedData.length - 9)*97 ;
			
			objClasses[0].style.marginLeft = counter +'px';


	};

	smallPhotoContainer.onclick = function(event){
		
		if (event.target.tagName ==='DIV'){
			chooseMainImg(event.target.childNodes[0]);
		}
		else if (event.target.tagName ==='IMG'){
			chooseMainImg(event.target);
		}
	};

	mainPhotoWrapper.onclick = function(event){

		if (event.target.tagName !== 'BUTTON'){
			return;
		}

		changeSlide(event.target);
	};

	addButt.addEventListener('click',getImageValues);

	function getImageValues(){
		
		writeToEndFile(input.value,input1.value);
		readFromFile('data');
		setTimeout(addListItem,640);
		input.value = "";
		input1.value = "";
	}

	function clearActiveClasses(){
		var activeClasses = document.getElementsByClassName('active');
		activeClasses[0].className = "small-photo-wrapper";
	};

	function changeMainImg(target){
		mainImg.src = target.src || target.url;
		mainImg.alt = target.alt || target.title;
		imgTitle.innerHTML = target.alt || target.title;
	};

	function chooseMainImg(target){

		clearActiveClasses();
		changeMainImg(target);

		target.parentNode.classList.add('active');
	};

	function changeSlide(target){
		if (target.className === "toggler left"){
			nextSlide(-1);
		}
		else{
			nextSlide(1);
		}
	};


	function nextSlide(target){
		
		var objClasses = document.getElementsByClassName('small-photo-wrapper');
		
		var index;
		for (i = 0;i < objClasses.length; i++){
			if (objClasses[i].classList.length === 2){
				index = i + target;
				if (i + target > parsedData.length - 1){
					index = 0;
				}
				else if (i + target < 0){
					index = parsedData.length - 1;
				}
				objClasses[index].classList.add("active");
				
				changeMainImg(parsedData[index]);
				
				objClasses[i].className = "small-photo-wrapper";
				
				bottomSwiper(index,target,objClasses[0]);

				
				break;
			}
		}

		
	};

	function bottomSwiper(index,target,obj){
		if (index > 8 && target === 1){
			counter -= 97;
			if (counter >= -(parsedData.length - 9)*97){
					obj.style.marginLeft = counter +'px';
			}
		}

		if (index === 0){
			counter = 0;
			obj.style.marginLeft = counter +'px';
		}

		if (counter < 0 && target === -1){
			counter += 97;
			obj.style.marginLeft = counter +'px';
		}

		if (index > 8 && target === -1){
			counter = -(parsedData.length - 9)*97;
			obj.style.marginLeft = counter +'px';
		}
	};



	

	var globFs = null;


	function errorHandler(e){ console.error(e) }
	function initFs(fs){

		globFs = fs;
		
	}



	function writeToEndFile(alt,src){
		setTimeout(function(){
		console.log("function=writeToEndFile");
		//removeFile('data')
		globFs.root.getFile('data.json', {create:false}, function(fileEntry) {

				fileEntry.createWriter(function(fileWriter) {
					
					fileWriter.seek(fileWriter.length-1);
					
					var galleryFile = new Blob([',' + JSON.stringify({title:alt, url:src})+']'],{type: 'text/plan'});
					console.log("galleryFile=",galleryFile);

					fileWriter.write(galleryFile);
					

				}, errorHandler);


			}, errorHandler);},20);


	}

	function writeToFile(object, fileName){

			setTimeout(function(){
		console.log("function=writeToFile");
			globFs.root.getFile(fileName+'.json', {create: true}, function(fileEntry) {

				fileEntry.createWriter(function(fileWriter) {

					fileWriter.seek(0);

					var b = new Blob([JSON.stringify(object)], {type: 'text/plain'});


					fileWriter.write(b);

				}, errorHandler);

			}, errorHandler);

		},230);
			
	};




	function readFromFile(fileName) {
	setTimeout(function(){
	console.log("function=readFromFile");
		  globFs.root.getFile(fileName+'.json', {}, function(fileEntry) {
		  	
				fileEntry.file(function(file) {
					var reader = new FileReader();

					reader.onloadend = function(e) {
						console.log("something");
						parsedData = JSON.parse(this.result);
						console.log(parsedData);
					};

					reader.readAsText(file);
				}, errorHandler);
			})

		},550);

	};

	
	function removeFile(fileName){
		setTimeout(function(){
			console.log("function=removeFile");
			globFs.root.getFile(fileName+'.json', {create: false}, function(fileEntry) {

			fileEntry.remove(function() {
				console.log('File '+fileName+' removed.');
								
			});

		}, function(){
			console.log("Can't remove file with name: "+fileName);
			

		});
		
		},50);
	}
	removeFile('data');
	writeToFile(data,'data');
	readFromFile('data');
};

