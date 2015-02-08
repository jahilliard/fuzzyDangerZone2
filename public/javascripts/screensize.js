$(document).ready(function() {
			$("nav#menu")
				.mmenu({
	classes		: "mm-light",
	counters	: true,
	searchfield	: true,
	header		: {
		add			: true,
		update		: true,
		title		: "Contacts"
	}
				}).on(
					'click',
					'a[href^="#/"]',
					function()
					{
						alert( "Thank you for clicking, but that's a demo link." );
						return false;
					}
				);
});