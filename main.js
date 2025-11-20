// Moved form interaction logic from inline script in index.html
document.addEventListener('DOMContentLoaded', () => {
	// Spouse visibility
	const vedybineRadios = document.querySelectorAll('input[name="vedybine"]');
	const sutuoktinisGroup = document.getElementById('sutuoktinis_group');
	function updateSutuoktinis() {
		const val = document.querySelector('input[name="vedybine"]:checked')?.value;
		if (!sutuoktinisGroup) return;
		if (val === 'vedes') sutuoktinisGroup.classList.remove('hidden'); else sutuoktinisGroup.classList.add('hidden');
	}
	vedybineRadios.forEach(r=>r.addEventListener('change', updateSutuoktinis));
	updateSutuoktinis();

	// Professional subgroups
	const profRadios = document.querySelectorAll('input[name="prof_padetis"]');
	function updateProfGroups() {
		const v = document.querySelector('input[name="prof_padetis"]:checked')?.value;
		const stud = document.getElementById('studijuoja_group');
		const dir = document.getElementById('dirba_group');
		const ned = document.getElementById('nedirba_group');
		const ato = document.getElementById('atostogos_group');
		if (stud) stud.style.display = (v === 'studijuoja') ? 'block' : 'none';
		if (dir) dir.style.display = (v === 'dirba') ? 'block' : 'none';
		if (ned) ned.style.display = (v === 'nedirba') ? 'block' : 'none';
		if (ato) ato.style.display = (v === 'atostogos') ? 'block' : 'none';
	}
	profRadios.forEach(r=>r.addEventListener('change', updateProfGroups));
	updateProfGroups();

	// Darbo patirtis: show years input only when 'taip' selected
	const darboPatirtisRadios = document.querySelectorAll('input[name="turi_darbo_patirtis"]');
	function updateDarboPatirtis() {
		const v = document.querySelector('input[name="turi_darbo_patirtis"]:checked')?.value;
		const group = document.getElementById('darbo_patirtis_group');
		const darboSritis = document.getElementById('darbo_sritis_fieldset');
		if (group) group.style.display = (v === 'taip') ? 'block' : 'none';
		// hide 'Darbo sritis' unless user has work experience
		if (darboSritis) darboSritis.style.display = (v === 'taip') ? 'block' : 'none';
	}
	darboPatirtisRadios.forEach(r=>r.addEventListener('change', updateDarboPatirtis));
	// initialize
	updateDarboPatirtis();

	// Placeholder submit handler (server-side validation expected)
	const form = document.getElementById('personal-data-form');
	if (form) {
		form.addEventListener('submit', (e) => {
			// no-op for now; keep default behaviour
		});
	}
});
