document.addEventListener('DOMContentLoaded', ()=>{
	const btn = document.querySelector('.sidebar-toggle');
	const sidebar = document.querySelector('.sidebar');
	if(!btn || !sidebar) return;
	setTimeout(() => {sidebar.classList.remove('no-anim')}, 1000);

	btn.addEventListener('click', ()=>{
		sidebar.classList.toggle('open');
		sidebar.classList.remove('no-anim');
	});
});