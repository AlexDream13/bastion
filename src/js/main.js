let intervalId;

document.querySelectorAll('.dropdown__toggle').forEach(e => {
	e.addEventListener('click', function (e){
		const menu = e.currentTarget.dataset.path;
				console.log(menu);
        
		document.querySelectorAll('.dropdown__menu').forEach(e => {
			
			if (!document.querySelector(`[data-target=${menu}]`).classList.contains('open')) {
				e.classList.remove('menu-active');
				e.classList.remove('open');
				document.querySelector(`[data-target=${menu}]`).classList.add('menu-active');
				intervalId = setTimeout(() => {
					document.querySelector(`[data-target=${menu}]`).classList.add('open');
				}, 0);
			}

			if (document.querySelector(`[data-target=${menu}]`).classList.contains('open')) {
				clearTimeout(intervalId);
				document.querySelector(`[data-target=${menu}]`).classList.remove('menu-active');
				
				intervalId = setTimeout(() => {
					document.querySelector(`[data-target=${menu}]`).classList.remove('open');
				}, 0);
			}

			window.onclick = e => {
				if (e.target == document.querySelector(`[data-target=${menu}]`) || e.target == document.querySelector(`[data-path=${menu}]`)) {
					return;
				} else {
					document.querySelector(`[data-target=${menu}]`).classList.remove('menu-active');
					
					document.querySelector(`[data-target=${menu}]`).classList.remove('open');
				}
			}
		});
	});
});