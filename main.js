// Moved form interaction logic from inline script in index.html
document.addEventListener('DOMContentLoaded', () => {

    // --- Language switching (LT / EN) ---
	const ltToEn = {
		'Anketos forma': 'Personal Data Form',
		'Lytis': 'Gender',
		'Vardas / pavardė': 'Name / Surname',
		'Gimimo duomenys': 'Birth information',
		'Išsilavinimas': 'Education',
		'Kontaktai': 'Contact',
		'Vedybinė padėtis': 'Marital status',
		'Profesinė padėtis': 'Professional status',
		'Darbo patirtis': 'Work experience',
		'Darbo sritis': 'Field of work',
		'Vardas': 'First name',
		'Antrasis vardas': 'Middle name',
		'Pavardė': 'Surname',
		'Gimimo data (formatas: yyyy/mm/dd)': 'Birth date (format: yyyy/mm/dd)',
		'Asmens kodas': 'Personal code',
		'Paskutinė baigta mokslo / studijų įstaiga': 'Last completed institution',
		'Baigimo metai': 'Graduation year',
		'Kvalifikacija (specialybės pavadinimas)': 'Qualification (specialty name)',
		'Mokslo laipsnis': 'Academic degree',
		'Telefono numeris': 'Phone number',
		'El. pašto adresas': 'Email address',
		'Gyvenamoji vieta (adresas)': 'Address',
		'Sutuoktinis(-ė) vardas': 'Spouse first name',
		'Sutuoktinis(-ė) pavardė': 'Spouse surname',
		'Studijų pakopa': 'Study level',
		'Kursas': 'Course',
		'Įstaiga': 'Institution',
		'Tikėtini baigimo metai': 'Expected graduation year',
		'Darbo įstaiga': 'Employer',
		'Pareigos': 'Position',
		'Nedarbo priežastis': 'Reason for unemployment',
		'Atostogų pabaiga': 'End of leave',
		'Darbo patirtis (metai)': 'Work experience (years)',
		'Turiu darbo patirties': 'I have work experience',
		'Neturiu darbo patirties': "I don't have work experience",
		'Siųsti': 'Submit',
		'Išvalyti': 'Reset',
		'Pagrindinis': 'Primary',
		'Vidurinis': 'Secondary',
		'Profesinis': 'Vocational',
		'Aukštasis - kolegijinis': 'Higher - college',
		'Aukštasis - universitetinis': 'Higher - university',
		'Nevedęs / Netekėjusi': 'Single',
		'Vedęs / Ištekėjusi': 'Married',
		'Išsiskyręs(-usi)': 'Divorced',
		'Studijuoja': 'Studying',
		'Studijuoja — duomenys': 'Studying — details',
		'Dirba': 'Working',
		'Nedirba': 'Not working',
		'Motinystės / tėvystės atostogose': 'On maternity/paternity leave',
		'Teisė': 'Law',
		'Viešasis sektorius': 'Public sector',
		'Sveikatos apsauga': 'Healthcare',
		'Farmacija': 'Pharmacy',
		'Pramonė / gamyba': 'Industry / Manufacturing',
		'IT': 'IT',
		'Prekyba': 'Trade',
		'Krašto apsauga': 'Defense',
		'Vidaus reikalų sistema': 'Internal affairs',
		'Klientų aptarnavimas ir paslaugos': 'Customer service and services',
		'Transportas': 'Transport',
		'Kultūra ir pramogos': 'Culture and entertainment',
		'Švietimas / studijos': 'Education / studies',
		'Vyras': 'Male',
		'Moteris': 'Female'
	};

	// translation and validation messages
	const messages = {
		lt: {
			emptyField: 'Prašome užpildyti šį lauką',
			groupMissing: 'Prašome pasirinkti vieną iš variantų',
			personalIdFormat: 'Asmens kodas turi būti 11 skaitmenų',
			personalIdMismatch: 'Asmens kodas neatitinka gimimo datos',
			birthEmpty: 'Prašome įvesti gimimo datą (formatas: yyyy/mm/dd)',
			birthFormat: 'Netinkamas formatas. Įveskite datą formatu yyyy/mm/dd',
			moksloPlaceholder: 'pvz. Bakalauro, Magistro, Profesinio bakalauro'
			,submitSuccess: 'Forma sėkmingai pateikta'
		},
		en: {
			emptyField: 'Please fill out this field',
			groupMissing: 'Please select one of the options',
			personalIdFormat: 'Personal ID must be 11 digits',
			personalIdMismatch: 'Personal ID does not match birth date',
			birthEmpty: 'Please enter birth date (format: yyyy/mm/dd)',
			birthFormat: 'Invalid format. Enter date as yyyy/mm/dd',
			moksloPlaceholder: 'e.g. Bachelor, Master, Professional Bachelor'
			,submitSuccess: 'Form submitted successfully'
		}
	};

	let currentLang = localStorage.getItem('lang') || 'lt';
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

		// --- Date helpers: simple mask (yyyy/mm/dd) and calendar validation ---
		function maskDateValue(value) {
			const digits = (value || '').replace(/\D/g, '').slice(0, 8);
			if (digits.length <= 4) return digits;
			if (digits.length <= 6) return digits.slice(0,4) + '/' + digits.slice(4);
			return digits.slice(0,4) + '/' + digits.slice(4,6) + '/' + digits.slice(6);
		}

		function isValidCalendarDate(s) {
			// expect yyyy/mm/dd
			if (!/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(s)) return false;
			const [y, m, d] = s.split('/').map(n => parseInt(n,10));
			if (m < 1 || m > 12) return false;
			if (d < 1) return false;
			const mdays = [31, (y%4===0 && (y%100!==0 || y%400===0)) ? 29 : 28, 31,30,31,30,31,31,30,31,30,31];
			if (d > mdays[m-1]) return false;
			return true;
		}

		// Verify Lithuanian-style personal id: 11 digits, structure: 1 digit + YYMMDD + 3 digits + checksum
		// We check length and that the YYMMDD portion matches the provided birthdate (yyyy/mm/dd -> YYMMDD)
		function personalIdVerification(personalId, birthYmd) {
			if (!personalId) return { valid: false, reason: 'empty' };
			const digits = String(personalId).replace(/\D/g, '');
			if (digits.length !== 11) return { valid: false, reason: 'length' };
			// expect birthYmd in yyyy/mm/dd; convert to YYMMDD
			if (!birthYmd || !isValidCalendarDate(birthYmd)) return { valid: false, reason: 'birth_invalid' };
			const [y, m, d] = birthYmd.split('/').map(n => n.padStart(2, '0'));
			const yy = y.slice(-2);
			const yymmdd = yy + m + d; // 6 chars
			// In Lithuanian personal id, positions 2-7 (index 1..6) are YYMMDD
			const idDatePart = digits.slice(1, 7);
			if (idDatePart !== yymmdd) return { valid: false, reason: 'mismatch', idDatePart, yymmdd };
			// basic structural pass
			return { valid: true };
		}

		// helper: validate and set customValidity on the asmens_kodas input
		function validatePersonalIdInput() {
			const pid = document.getElementById('asmens_kodas');
			if (!pid) return true;
			const val = pid.value.trim();
			if (!val) {
				pid.setCustomValidity('');
				return true; // empty handled by required handling
			}
			const birth = document.getElementById('gimimo_data')?.value;
			const res = personalIdVerification(val, birth);
			if (!res.valid) {
				if (res.reason === 'length') pid.setCustomValidity(messages[currentLang].personalIdFormat);
				else if (res.reason === 'mismatch' || res.reason === 'birth_invalid') pid.setCustomValidity(messages[currentLang].personalIdMismatch);
				else pid.setCustomValidity(messages[currentLang].personalIdFormat);
				return false;
			} else {
				pid.setCustomValidity('');
				return true;
			}
		}

		// Alerts will be shown on submit (standard alert()); no form-level element is used.

		// Birthdate: mask input and validate calendar semantics
		const gimimoInput = document.getElementById('gimimo_data');
		if (gimimoInput) {
			gimimoInput.addEventListener('input', (e) => {
				const before = gimimoInput.value;
				const masked = maskDateValue(before);
				if (masked !== before) gimimoInput.value = masked;
				// clear custom validity while typing; if full length, run calendar validation
				gimimoInput.setCustomValidity('');
				if (gimimoInput.value.length === 10) {
					if (!isValidCalendarDate(gimimoInput.value)) {
						gimimoInput.setCustomValidity(messages[currentLang].birthFormat);
					} else {
						gimimoInput.setCustomValidity('');
					}
				}
			});

			gimimoInput.addEventListener('invalid', (e) => {
				if (!gimimoInput.value) {
					gimimoInput.setCustomValidity(messages[currentLang].birthEmpty);
				} else if (!isValidCalendarDate(gimimoInput.value)) {
					gimimoInput.setCustomValidity(messages[currentLang].birthFormat);
				}
			});
		}

		// Atostogų pabaiga - same mask and calendar validation
		const atostoguInput = document.getElementById('atostogu_pabaiga');
		if (atostoguInput) {
			atostoguInput.addEventListener('input', (e) => {
				const before = atostoguInput.value;
				const masked = maskDateValue(before);
				if (masked !== before) atostoguInput.value = masked;
				atostoguInput.setCustomValidity('');
				if (atostoguInput.value.length === 10) {
					if (!isValidCalendarDate(atostoguInput.value)) {
						atostoguInput.setCustomValidity(messages[currentLang].birthFormat);
					} else {
						atostoguInput.setCustomValidity('');
					}
				}
			});

			atostoguInput.addEventListener('invalid', () => {
				if (!atostoguInput.value) {
					atostoguInput.setCustomValidity(messages[currentLang].birthEmpty);
				} else if (!isValidCalendarDate(atostoguInput.value)) {
					atostoguInput.setCustomValidity(messages[currentLang].birthFormat);
				}
			});
		}

		// Hide or show marital-status (vedybine) depending on age >= 16
		function computeAgeFromYMD(ymd) {
			if (!ymd || !isValidCalendarDate(ymd)) return null;
			const [y, m, d] = ymd.split('/').map(n => parseInt(n,10));
			const today = new Date();
			let age = today.getFullYear() - y;
			if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) {
				age -= 1;
			}
			return age;
		}

		function updateVedybineVisibility() {
			const vedyFs = document.querySelector('input[name="vedybine"]')?.closest('fieldset');
			if (!vedyFs) return;
			const value = document.getElementById('gimimo_data')?.value;
			const age = computeAgeFromYMD(value);
			if (age === null) {
				// hide until valid birthdate entered
				vedyFs.style.display = 'none';
				// clear selection
				vedyFs.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
				// also hide spouse subgroup
				if (sutuoktinisGroup) sutuoktinisGroup.classList.add('hidden');
				return;
			}
			if (age >= 16) {
				vedyFs.style.display = '';
			} else {
				vedyFs.style.display = 'none';
				vedyFs.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
				if (sutuoktinisGroup) sutuoktinisGroup.classList.add('hidden');
			}
		}

		// wire age-based visibility to birthdate input
		if (gimimoInput) {
			// run on init
			updateVedybineVisibility();
			// also update whenever birthdate changes
			gimimoInput.addEventListener('input', updateVedybineVisibility);
			// also re-validate personal id whenever birthdate changes
			gimimoInput.addEventListener('input', validatePersonalIdInput);
				// validate pid as user types
				const pidEl = document.getElementById('asmens_kodas');
				if (pidEl) pidEl.addEventListener('input', validatePersonalIdInput);
		}

	// Mark required labels/fieldsets and add submit-time invalid-state styling
	const form = document.getElementById('personal-data-form');
	if (form) {
		// find all required controls inside the form
		const requiredControls = Array.from(form.querySelectorAll('[required]'));

		// Add visual '*' to labels or fieldsets for required fields
		// Add visual '*' to labels for required fields.
		// For radios/checkboxes we add the star to each option label instead of the fieldset.
		requiredControls.forEach(el => {
			if (el.type === 'radio' || el.type === 'checkbox') {
				// add required mark to the labels that wrap or reference the inputs in this group
				const name = el.name;
				const inputs = Array.from(form.querySelectorAll(`input[name="${name}"]`));
				inputs.forEach(inp => {
					// label may wrap the input or be a for="id" label
					let lbl = inp.closest('label');
					if (!lbl && inp.id) lbl = form.querySelector(`label[for="${inp.id}"]`);
					if (lbl) lbl.classList.add('required-label');
				});
			} else if (el.id) {
				const lbl = form.querySelector(`label[for="${el.id}"]`);
				if (lbl) lbl.classList.add('required-label');
			}
		});

		// clear invalid marker and custom validity as user edits
		requiredControls.forEach(el => {
			const ev = (el.type === 'radio' || el.type === 'checkbox') ? 'change' : 'input';
			el.addEventListener(ev, () => {
				if (el.type === 'radio') {
					// remove invalid class from the group fieldset when any selected
					const name = el.name;
					const radios = Array.from(form.querySelectorAll(`input[name="${name}"]`));
					const any = radios.some(r => r.checked);
					const fs = el.closest('fieldset');
					if (fs) {
						if (any) fs.classList.remove('invalid-required');
					}
					// clear custom validity for the group
					radios.forEach(r => r.setCustomValidity(''));
				} else {
					if (el.checkValidity()) el.classList.remove('invalid-required');
					el.setCustomValidity('');
				}
			});

		// progress bar update helper (counts visible required controls and how many are satisfied)
		function isVisible(node) {
			// If the node is a radio/checkbox input that is visually hidden (opacity:0)
			// treat the element as visible if its associated label is visible.
			if (node && node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
				let lbl = node.closest('label');
				if (!lbl && node.id) lbl = document.querySelector(`label[for="${node.id}"]`);
				if (lbl) node = lbl; // continue visibility checks from the label
			}
			let n = node;
			while (n && n !== document) {
				if (n.hidden) return false;
				const s = window.getComputedStyle(n);
				if (s.display === 'none' || s.visibility === 'hidden') return false;
				// allow inputs that are visually hidden via opacity (we render custom dots) as visible
				if (n.tagName === 'INPUT' && parseFloat(s.opacity) === 0) {
					// if there's a wrapping label and it's visible, consider visible (handled above)
					// otherwise treat as visible to avoid false negatives
					// continue up the tree
				}
				n = n.parentElement;
			}
			return true;
		}

		function updateProgress() {
			const progressBar = document.getElementById('progress-bar');
			const progressLabel = document.getElementById('progress-label');
			if (!progressBar || !progressLabel) return;

			// count required single inputs (non-radio/checkbox)
			const requiredSingles = Array.from(form.querySelectorAll('[required]')).filter(el => el.type !== 'radio' && el.type !== 'checkbox');

			// collect all radio/checkbox groups (include optional groups too)
			const allRadios = Array.from(form.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
			// exclude the 'vedybine' (marital status) group from progress calculation
			const groupNames = Array.from(new Set(allRadios.map(i => i.name).filter(Boolean))).filter(n => n !== 'vedybine');

			let total = 0, done = 0;

			// radio/checkbox groups: count each visible group once (user selecting any option counts it as done)
			groupNames.forEach(name => {
				const inputs = Array.from(form.querySelectorAll(`input[name="${name}"]`));
				const anyVisible = inputs.some(i => isVisible(i));
				if (!anyVisible) return;
				total += 1;
				const anyChecked = inputs.some(i => i.checked);
				if (anyChecked) done += 1;
			});

			// required single inputs
			requiredSingles.forEach(el => {
				if (!isVisible(el)) return;
				total += 1;
				if (el.checkValidity()) done += 1;
			});

			const pct = total === 0 ? 100 : Math.round((done / total) * 100);
			progressBar.style.width = pct + '%';
			progressBar.setAttribute('aria-valuenow', String(pct));
			progressLabel.textContent = pct + '%';
		}

		// wire progress updates to required control events
		requiredControls.forEach(el => {
			const ev = (el.type === 'radio' || el.type === 'checkbox') ? 'change' : 'input';
			el.addEventListener(ev, updateProgress);
		});

		// also wire all radio/checkbox inputs (including optional groups) so selecting a bubble updates progress
		const allChoiceInputs = Array.from(form.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
		allChoiceInputs.forEach(i => i.addEventListener('change', updateProgress));

		// also update on visibility-changing controls
		// profession and work-experience radios change visible required fields
		const profs = document.querySelectorAll('input[name="prof_padetis"]');
		profs.forEach(r => r.addEventListener('change', updateProgress));
		const darboPat = document.querySelectorAll('input[name="turi_darbo_patirtis"]');
		darboPat.forEach(r => r.addEventListener('change', updateProgress));
		const vedy = document.querySelectorAll('input[name="vedybine"]');
		vedy.forEach(r => r.addEventListener('change', updateProgress));

		// update when form is reset or on init
		form.addEventListener('reset', () => setTimeout(updateProgress, 10));
		// initial progress
		setTimeout(updateProgress, 50);
			// provide Lithuanian custom messages on invalid for empty required fields
			el.addEventListener('invalid', (ev) => {
				// keep specialized handlers (e.g. birthdate, leave date) intact
				if (el.id === 'gimimo_data' || el.id === 'atostogu_pabaiga') return;

				if (el.type === 'radio' || el.type === 'checkbox') {
					const name = el.name;
					const radios = Array.from(form.querySelectorAll(`input[name="${name}"]`));
					const any = radios.some(r => r.checked);
					if (!any) {
						// set message on all radios in group so browser shows it
						radios.forEach(r => r.setCustomValidity(messages[currentLang].groupMissing));
					}
				} else {
					if (el.validity.valueMissing) {
						el.setCustomValidity(messages[currentLang].emptyField);
					}
				}
			});
		});

		// On submit, mark invalid controls with class 'invalid-required' and add 'was-validated' to form
		form.addEventListener('submit', (e) => {
			form.classList.add('was-validated');
			let foundInvalid = false;
			requiredControls.forEach(el => {
				if (el.type === 'radio' || el.type === 'checkbox') {
					const name = el.name;
					const radios = Array.from(form.querySelectorAll(`input[name="${name}"]`));
					const any = radios.some(r => r.checked);
					const fs = el.closest('fieldset');
					if (!any) {
						if (fs) fs.classList.add('invalid-required');
						// set Lithuanian custom validity on the group so browser shows it
							radios.forEach(r => r.setCustomValidity(messages[currentLang].groupMissing));
						foundInvalid = true;
					} else {
						if (fs) fs.classList.remove('invalid-required');
						radios.forEach(r => r.setCustomValidity(''));
					}
				} else {
					if (!el.checkValidity()) {
						el.classList.add('invalid-required');
						// if empty, set Lithuanian prompt
							if (el.validity.valueMissing) el.setCustomValidity(messages[currentLang].emptyField);
						foundInvalid = true;
					} else {
						el.classList.remove('invalid-required');
						el.setCustomValidity('');
					}
						// additional validation: if this is personal id, re-check consistency with birthdate
						if (el.id === 'asmens_kodas' && el.value) {
							const ok = validatePersonalIdInput();
							if (!ok) {
								el.classList.add('invalid-required');
								// show a form-level message under the form instead of modal alert
								const birth = document.getElementById('gimimo_data')?.value;
								const res = personalIdVerification(el.value, birth);
								const msg = (res && res.reason === 'length') ? messages[currentLang].personalIdFormat : messages[currentLang].personalIdMismatch;
								// alert suppressed: browser will show validation messages in-form
								foundInvalid = true;
							}
						}
				}
			});
			// If we found invalid controls, prevent submission, show validation UI and focus first invalid
			if (foundInvalid) {
				e.preventDefault();
				// focus the first element that has invalid-required class or the first :invalid
				const firstInvalid = form.querySelector('.invalid-required') || form.querySelector(':invalid');
				if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
				// ask the browser to show validation messages (will use any customValidity set earlier)
				form.reportValidity();
				return false;
			}
			// otherwise allow submit to proceed: serialize and save form data, then log it
			try {
				const data = {};
				// iterate form controls to build a sensible object
				Array.from(form.elements).forEach(el => {
					if (!el.name) return;
					const name = el.name;
					const type = el.type;
					if (type === 'fieldset' || el.disabled) return;
					if (type === 'radio') {
						if (!(name in data)) data[name] = null;
						if (el.checked) data[name] = el.value;
						return;
					}
					if (type === 'checkbox') {
						// collect multiple checkboxes with same name into arrays; single checkbox -> boolean
						const group = Array.from(form.querySelectorAll(`input[name="${name}"][type="checkbox"]`));
						if (group.length > 1) {
							if (!Array.isArray(data[name])) data[name] = [];
							if (el.checked) data[name].push(el.value);
						} else {
							data[name] = !!el.checked;
						}
						return;
					}
					if (type === 'select-multiple') {
						data[name] = Array.from(el.options).filter(o => o.selected).map(o => o.value);
						return;
					}
					// default: value
					data[name] = el.value;
				});
				// persist to localStorage and log to console
				try { localStorage.setItem('formSubmission', JSON.stringify(data)); } catch (err) { /* ignore storage errors */ }
				console.log('Form submitted successfully. Serialized data object:');
				console.log(data);
				console.table(data);
				// prevent default navigation/reload and show a success message on the page
				e.preventDefault();
				function showSuccess(msg) {
					let el = document.getElementById('form-success');
					if (!el) {
						el = document.createElement('div');
						el.id = 'form-success';
						el.setAttribute('role', 'status');
						el.setAttribute('aria-live', 'polite');
						// styling: make the success box appear below the form even when body uses flex layout
						el.style.display = 'block';
						el.style.width = '100%';
						el.style.boxSizing = 'border-box';
						el.style.maxWidth = '980px';
						el.style.margin = '0.75rem auto 0';
						// when the page root uses flex layout, force the success element to occupy full row
						el.style.flexBasis = '100%';
						el.style.alignSelf = 'center';
						el.style.textAlign = 'center';
						el.style.padding = '0.6rem 0.75rem';
						el.style.background = 'rgba(16, 185, 129, 0.08)';
						el.style.color = '#065f46';
						el.style.border = '1px solid rgba(16,185,129,0.2)';
						el.style.borderRadius = '6px';
						const formEl = document.getElementById('personal-data-form');
						if (formEl && formEl.parentNode) formEl.parentNode.insertBefore(el, formEl.nextSibling);
					}
					el.textContent = msg;
				}
				showSuccess(messages[currentLang].submitSuccess || 'Form submitted successfully');
			} catch (err) {
				console.error('Error serializing form data:', err);
			}
			// we've prevented navigation and shown a success message; keep the page as-is
			return false;
		});

		// --- Robust delegated progress updater ---
		// Some environments or dynamic DOM changes can prevent per-control listeners from firing.
		// Add a delegated listener on the form which recomputes progress on any change/input event.
		function computeAndSetProgress(ev) {
			const progressBar = document.getElementById('progress-bar');
			const progressLabel = document.getElementById('progress-label');
			if (!progressBar || !progressLabel || !form) return;

			// Debug: log trigger info
			try {
				const trig = ev && ev.target ? (ev.target.name || ev.target.id || ev.target.className || ev.target.tagName) : 'init/reset';
				console.log('[progress] triggered by:', ev ? ev.type : 'programmatic', trig);
			} catch (err) {
				/* ignore logging errors */
			}

			function isVisible(node) {
				// If the node is a radio/checkbox input that's visually hidden, prefer its label for visibility checks
				if (node && node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
					let lbl = node.closest('label');
					if (!lbl && node.id) lbl = document.querySelector(`label[for="${node.id}"]`);
					if (lbl) node = lbl;
				}
				let n = node;
				while (n && n !== document) {
					if (n.hidden) return false;
					const s = window.getComputedStyle(n);
					if (s.display === 'none' || s.visibility === 'hidden') return false;
					// don't treat opacity:0 as hidden for inputs used as visual offscreen controls
					n = n.parentElement;
				}
				return true;
			}

			const requiredSingles = Array.from(form.querySelectorAll('[required]')).filter(el => el.type !== 'radio' && el.type !== 'checkbox');
			const allChoices = Array.from(form.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
			const groupNames = Array.from(new Set(allChoices.map(i => i.name).filter(Boolean))).filter(n => n !== 'vedybine');

			let total = 0, done = 0;

			const groupsInfo = groupNames.map(name => {
				const inputs = Array.from(form.querySelectorAll(`input[name="${name}"]`));
				const anyVisible = inputs.some(i => isVisible(i));
				const anyChecked = inputs.some(i => i.checked);
				if (anyVisible) {
					total += 1;
					if (anyChecked) done += 1;
				}
				return { name, visible: anyVisible, checked: anyChecked, count: inputs.length };
			});

			const singlesInfo = requiredSingles.map(el => {
				const visible = isVisible(el);
				if (visible) total += 1;
				const ok = visible && el.checkValidity();
				if (ok) done += 1;
				return { id: el.id || el.name || null, visible, ok };
			});

			// Debug: log computed groups and singles as JSON for easy inspection
			try {
				console.log('[progress] groups (json):', JSON.stringify(groupsInfo, null, 2));
				console.log('[progress] required singles (json):', JSON.stringify(singlesInfo, null, 2));
			} catch (err) {
				console.log('[progress] groups:', groupsInfo);
				console.log('[progress] required singles:', singlesInfo);
			}

			const pct = total === 0 ? 100 : Math.round((done / total) * 100);
			// Debug: log totals
			console.log('[progress] total:', total, 'done:', done, 'pct:', pct + '%');
			progressBar.style.width = pct + '%';
			progressBar.setAttribute('aria-valuenow', String(pct));
			progressLabel.textContent = pct + '%';
		}

		// Delegated listeners: fire compute on any change/input inside the form
		form.addEventListener('change', (ev) => {
			// run only for inputs/selects/textarea changes to avoid noise
			const t = ev.target;
			if (!t) return;
			if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') computeAndSetProgress(ev);
		});
		form.addEventListener('input', (ev) => {
			const t = ev.target;
			if (!t) return;
			if (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') computeAndSetProgress(ev);
		});

		// ensure progress is correct after reset/init
		form.addEventListener('reset', () => setTimeout(computeAndSetProgress, 20));
		setTimeout(computeAndSetProgress, 50);
	}

		function setLanguage(lang) {
			currentLang = lang;
			localStorage.setItem('lang', lang);
			// update active flag
			document.querySelectorAll('.lang-flag').forEach(img => img.classList.remove('active'));
			const active = document.getElementById(lang === 'en' ? 'lang-en' : 'lang-lt');
			if (active) active.classList.add('active');
			// update aria-pressed state for screen readers / keyboard users
			document.querySelectorAll('.lang-flag').forEach(img => img.setAttribute('aria-pressed', 'false'));
			if (active) active.setAttribute('aria-pressed', 'true');

			// translate textual elements
			const nodes = document.querySelectorAll('h1, legend, label, button, strong');
			nodes.forEach(el => {
				const text = el.textContent.trim();
				if (lang === 'en') {
					if (ltToEn[text]) {
						// store original lt text if not stored
						if (!el.dataset.lt) el.dataset.lt = text;
						// replace only the text node to preserve child inputs
						const tn = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim().length>0);
						if (tn) tn.nodeValue = tn.nodeValue.replace(tn.nodeValue.trim(), ltToEn[text]); else el.textContent = ltToEn[text];
					}
				} else {
					// revert to stored lt
					if (el.dataset.lt) {
						const orig = el.dataset.lt;
						const tn = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.nodeValue.trim().length>0);
						if (tn) tn.nodeValue = tn.nodeValue.replace(tn.nodeValue.trim(), orig); else el.textContent = orig;
					}
				}
			});

			// placeholders/titles
			const gim = document.getElementById('gimimo_data');
			if (gim) {
				if (lang === 'en') {
					gim.title = 'Enter date as yyyy/mm/dd';
				} else {
					gim.title = 'Įveskite datą formatu yyyy/mm/dd';
				}
			}

			// atostogu_pabaiga title/placeholder
			const atost = document.getElementById('atostogu_pabaiga');
			if (atost) {
				if (lang === 'en') {
					atost.title = 'Enter date as yyyy/mm/dd';
					// store lt placeholder if not stored
					if (!atost.dataset.ltPlaceholder) atost.dataset.ltPlaceholder = atost.placeholder || '';
					atost.placeholder = 'yyyy/mm/dd';
				} else {
					atost.title = 'Įveskite datą formatu yyyy/mm/dd';
					atost.placeholder = atost.dataset.ltPlaceholder || 'yyyy/mm/dd';
				}
			}

			// translate placeholder for mokslo laipsnis
			const mokslo = document.getElementById('mokslo_laipsnis');
			if (mokslo) {
				if (lang === 'en') {
					// store lt placeholder if not stored
					if (!mokslo.dataset.ltPlaceholder) mokslo.dataset.ltPlaceholder = mokslo.placeholder || '';
					mokslo.placeholder = messages.en.moksloPlaceholder;
				} else {
					mokslo.placeholder = mokslo.dataset.ltPlaceholder || messages.lt.moksloPlaceholder;
				}
			}

			// update validation language in case some custom messages are currently set
			// clear customValidity for required fields so invalid events will set messages in the current language
			const requiredControls = Array.from(document.querySelectorAll('#personal-data-form [required]'));
			requiredControls.forEach(el => el.setCustomValidity(''));
		}

		// wire flag buttons
		const btnLt = document.getElementById('lang-lt');
		const btnEn = document.getElementById('lang-en');
		function makeFlagInteractive(el, lang) {
			if (!el) return;
			el.addEventListener('click', () => setLanguage(lang));
			el.addEventListener('keydown', (ev) => {
				// support Enter and Space
				if (ev.key === 'Enter' || ev.key === ' ') {
					ev.preventDefault();
					setLanguage(lang);
				}
			});
		}
		makeFlagInteractive(btnLt, 'lt');
		makeFlagInteractive(btnEn, 'en');
		// initialize UI language
		setLanguage(currentLang);
});
