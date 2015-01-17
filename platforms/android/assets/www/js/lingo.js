var colors = ["#ECF0F1", "#728D9A", "#727E9A", "#729A7A"];

var categoriesHash = {};
	
$.getJSON( "lingo.json",
	function(data) {
	$.each(data, function(item){
		gatherCategorydata(data, item);
	});

	showMainMenu();
})
.done(function() { console.log( "done" ); })
.fail(function() { console.log( "error" );});
	
function gatherCategorydata(data, item) {
	for(var i =0;i < data[item].categories.length;i++) {
		gatherSubcategoriesInfo (i, data, item, data[item].categories[i].subcategories.length);
	}
}
	
function gatherSubcategoriesInfo (categoryIndex, data, item, numberOfSubCategories) {
	var subCategories = [];
	for(w=0;w<numberOfSubCategories;w++) {
		subCategories[w] = [data[item].categories[categoryIndex].subcategories[w].title,
							data[item].categories[categoryIndex].subcategories[w].ddc,
							data[item].categories[categoryIndex].subcategories[w].lcc];
	}
		
	categoriesHash[data[item].categories[categoryIndex].title] =
		[data[item].categories[categoryIndex].title,
		data[item].categories[categoryIndex].img,
		subCategories];
}
	 
function showMainMenu() {
	window.scrollTo(0, 0);
	$("<div>", {'class': 'ends'}).append(
		$("<span>", {
			'html': 'Pick a Subject'
		})).appendTo("#lingo");

	for (var subject in categoriesHash ) {
		var lingoCategory = $("<div/>");

		lingoCategory.attr("class", "category").css("background-color", colors[Math.floor((Math.random()*3)+1)])
			.attr("onclick", "showSubCategories(categoriesHash['" + subject + "'])")
			.html("<img src=\"img\/" + categoriesHash[subject][1] + "\"></br>" + subject)
			.appendTo("#lingo");
	}

	$("<div>", {'class': 'ends'}).append(
		$("<span>", {
			'html': 'More Info'
		}))
		.click(showMore)
		.appendTo("#lingo");

}
	 
function showSubCategories(category) {
	window.scrollTo(0, 0);
	$('#lingo').hide();
	$('#lingoData').empty();
	categoryPicture = category[1];
	Subcategories = category[2];
	for(i=-1;i<Subcategories.length;i++) {
		var lingoSubCategory = $("<div/>");
		if ((i%2)===0){
			renderSubCategoryCell(lingoSubCategory, Subcategories[i], colors[1]);
		} else if ((i%2)==1){
			renderSubCategoryCell(lingoSubCategory, Subcategories[i], colors[2]);
		} else if(i==-1) {
			lingoSubCategory.html("<div><img src=\"img\/" + categoryPicture + "\"></div><div>" + category[0] + "</div>")
				.attr("class", "categoryTitle")
				.click(backToMainMenu)
				.appendTo("#lingoData");
		}
	}
}

function renderSubCategoryCell(parent, subcategory, color) {
  parent.html("<table class=\"subCategoryTable\"><tr><td style=\"vertical-align:middle\">" + subcategory[0] + "</td></tr></table>")
  .attr("onclick", "showClassification('"+subcategory[0]+"','"+subcategory[1]+"','"+subcategory[2]+"')")
  .css("background-color", color).attr("class", "subCategory").appendTo("#lingoData");
}
	
function backToMainMenu() {
	$('#lingoData').empty();
	$('#more').empty();
	$('#lingo').show();
}

function backToSubCategories() {
	$('#lingoMoreData').empty();
	$('#lingoData').show();
}
	
function showClassification(title,ddc, lcc) {
	window.scrollTo(0, 0);
	$('#lingoData').hide();
	var lingoSubCategoryClassificationTitle  = $("<div/>");
		lingoSubCategoryClassificationTitle.html("<img src=\"img\/" + categoryPicture + "\"></br>" + title)
			.attr("class", "categoryTitle").appendTo("#lingoMoreData")
			.click(backToSubCategories);

	renderClassificationCell("detailCongress","Library of Congress</br>" +lcc, colors[1], "");
	renderClassificationCell("detailDewey","Dewey Decimal</br>" +ddc, colors[2], "");
	renderClassificationCell("detailMore","Learn More About Call Numbers", "#414042", "more");
	$("#detailMore").click(showMoreDetail);
}

function renderClassificationCell(name, text, color, clazz) {
	$("<div/>")
		.html("<table class=\"subCategoryClassificationTable\"><tr><td class=\"subCategoryClassificationCell\">" + text + "</td></tr></table>")
		.attr("class", "subCategoryClassification " + clazz)
		.attr("id", name)
		.css("background-color", color).appendTo("#lingoMoreData");
}

function showMoreDetail() {
	$("#lingoMoreData").hide();
	renderMore();
	$("#more").unbind('click');
	$("#more").click(function (){
		$("#more").empty();
		$("#lingoMoreData").show();
	});
}

function showMore() {
	$('#lingo').hide();
	renderMore();
	$("#more").unbind('click');
	$(".moreLogo").click(backToMainMenu);
}

function renderMore () {
	$("<div>", {'class': 'moreLogo'}).append(
		$("<img>", {
			'class': 'logo',
			'src': 'img/lingo-logo.png'
		})).appendTo("#more");
	$("<div>", {'class':'moreText'}).append(
		$("<a>", {
			'class':'more',
			'href': 'http://www.knowthelingo.org',
			'html': 'www.knowthelingo.org'
		})).appendTo("#more");
	$("<div>",{'class':'moreText'}).append(
		$("<a>", {
			'class':'more',
			'href': 'mailto:info@knowthelingo.org',
			'html': 'info@knowthelingo.org'
		})).appendTo("#more");

	$("<div>",{'class':'moreText'}).append("Acknowledgements:").appendTo("#more");
	$("<div>",{'class':'moreDetails'}).append("The Dewey Decimal Classification (http://dewey.info) is licensed under Creative Commons BY-NC-ND (http://creativecommons.org/licenses/by-nc-nd/3.0/) by OCLC Online Computer Library Center (http://www.oclc.org/dewey).").appendTo("#more");

	$(".moreText").click(function() {
		window.open('http://www.knowthelingo.org', '_system');
	});
}