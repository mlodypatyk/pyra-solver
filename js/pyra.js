function move(state, movename) {
	let new_state = '';
	for (let i = 0; i < 24; i++) {
		new_state += state[permutations[ruchy[movename]][i]];
	}
	return new_state;
}

function makeMoves(state, moves) {
	for (let j = 0; j < moves.length; j++) {
		if (moves[j].length === 2) {
			state = move(state, moves[j][0]);
		}
		state = move(state, moves[j][0]);
	}
	return state;
}

/*function findSolution(state) {
	let dict_scr = {};
	dict_scr[state] = [];
	let dict_sol = {};
	dict_sol[solved] = [];

	const turn_names = " '";

	const solutions = [];
	for (let k = 0; k < 6; k++) {
		dict_scr = getDictTmp(dict_scr, dict_scr, solutions);

		dict_sol = getDictTmp(dict_sol, dict_scr, solutions);
		if (solutions.length > 0) {
			break;
		}
	}
	const optimal = solutions[0].length;
	const optimal_solutions = [];
	for (let l = 0; l < solutions.length; l++) {
		if (solutions[l].length == optimal) {
			optimal_solutions.push(solutions[l]);
		}
	}
	return optimal_solutions;
}*/
function findSolution(state){
	dict_scr = {};
	dict_scr[state] = [];
	dict_sol = {};
	dict_sol[solved] = [];
	
	//turn_names = " '";
	
	solutions = []
	for(k=0;k<6;k++){
		tmp = {}
		$.each(dict_scr, function(state, moves){
			if(Object.keys(dict_sol).includes(state)){
				//console.log('ding dong')
				//console.log(moves.concat(dict_sol[state]));
				solutions.push(moves.concat(dict_sol[state]))
				//console.log(moves)
				//console.log(dict_sol[state]);
			}
			for(movenr = 0; movenr<4; movenr++){
				for(turn = 0; turn<2; turn++){
					state = move(state, ruchy2[movenr]);
					//console.log(moves)
					tmp[state] = moves.concat([ruchy2[movenr]+turn_names[turn]]);
					//console.log(moves);
					
				}
				state = move(state, ruchy2[movenr]);
				
			}
			
		}
		);
		dict_scr = tmp;
		tmp = {}
		$.each(dict_sol, function(state, moves){
			if(Object.keys(dict_scr).includes(state)){
				//console.log('ding dong')
				//console.log(dict_scr[state].concat(moves))
				solutions.push(dict_scr[state].concat(moves))
			}
			for(movenr = 0; movenr<4; movenr++){
				for(turn = 0; turn<2; turn++){
					state = move(state, ruchy2[movenr]);
					//console.log(moves)
					tmp[state] = [ruchy2[movenr]+turn_names[1-turn]].concat(moves)
					//console.log(moves);
					
				}
				state = move(state, ruchy2[movenr]);
			}
		}
		);
		dict_sol = tmp;
		if(solutions.length > 0){
			break;
		}
	}
	optimal = solutions[0].length;
	optimal_solutions = []
	for(l=0;l<solutions.length;l++){
		if(solutions[l].length == optimal){
			optimal_solutions.push(solutions[l]);
		}
	}
	return optimal_solutions;
	
	
}

function match(state, mode, mask) {
	let matchTable = [];
	if (mode == 0) {
		matchTable = v_list;
	}
	if (mode == 1) {
		matchTable = layer_list;
	}
	if (mode == 2) {
		matchTable = top_list;
	}
	for (let j = 0; j < matchTable.length; j++) {
		let czy = true;
		for (let k = 0; k < 24; k++) {
			if (matchTable[j][k] != '*' && matchTable[j][k] != state[k]) {
				czy = false;
			}
		}
		if (czy && mask[j]) {
			return true;
		}
	}
	return false;
}

function find(cube_state, mode) {
	let states = {};
	states[cube_state] = [];
	const solutions = [];
	const turn_names = " '";
	let mask = getMask(mode);

	while (solutions.length === 0) {
		const tmp = {};

		$.each(states, (state, moves) => {
			if (match(state, mode, mask)) {
				solutions.push(moves);
			}
			addToTmp(moves, state, tmp);
		});
		states = tmp;
	}
	return solutions;
}

function generate() {
	results.innerHTML = '';
	$(results).append('<div class="lds-dual-ring"></div>');
	setTimeout(() => {
		let scramble = textarea.value;
		scramble = scramble.replace(/\s*$/, '');

		const moves_list = scramble.split(' ').filter(x => x);
		for (const move of moves_list) {
			if (valid_moves.includes(move) === false) {
				results.innerHTML = "This doesn't seem like a scramble";
				return false;
			}
		}

		let body = [];
		let tips = [];
		let final_text = '';

		for (const i in moves_list) {
			if (moves_list[i][0] === moves_list[i][0].toLowerCase()) {
				body = moves_list.slice(0, i);
				tips = moves_list.slice(i, moves_list.length);
				break;
			}
		}

		if (body.length === 0) {
			body = moves_list;
		}

		if (tips.length > 4) {
			final_text += 'These tips seem weird man<br>';
		}

		const cube_state = makeMoves(solved, body);
		results.innerHTML = 'Computing...';

		const solutions = findSolution(cube_state);
		final_text += `Optimal length: ${solutions[0].length} body moves + ${tips.length} tips = ${solutions[0].length +
			tips.length} moves total<br>`;

		final_text += 'Solutions:<br>';

		solutions.forEach((solution) => {
			final_text += solution.join(' ') + '<br>';
		});

		results.innerHTML = final_text;

		const v_solutions = find(cube_state, 0);
		final_text = findMethodSolutions(v_solutions, 'v', final_text);

		const layer_solutions = find(cube_state, 1);
		final_text = findMethodSolutions(layer_solutions, 'layer', final_text);

		const top_solutions = find(cube_state, 2);
		final_text = findMethodSolutions(top_solutions, 'top', final_text);

		$('.lds-dual-ring').remove();
	}, 50);
}

function findMethodSolutions(arr, name, final_text) {
	final_text += `<br>Optimal ${name} length: ${arr[0].length}`;
	final_text += '<br>Solutions: <br>';
	arr.forEach((solution) => {
		final_text += solution.join(' ') + '<br>';
	});
	results.innerHTML = final_text;

	return final_text;
}

function getMask(mode) {
	switch (mode) {
		case 0:
			return getProperMask('v', 3);
		case 1:
			return getProperMask('l');
		case 2:
			return getProperMask('t');
		default:
			return [];
	}
}

function getProperMask(name, masks_per_input = 1) {
	const mask = Array(4 * masks_per_input).fill(false);
	let cokolwiek = false;
	for (let i = 0; i < 4; i++) {
		if (document.getElementById(`${name}${i + 1}`).checked) {
			const base_mask_id = i * masks_per_input;
			for (let mask_id = 0; mask_id < masks_per_input; mask_id++) mask[base_mask_id + mask_id] = true;
			cokolwiek = true;
		}
	}

	if (!cokolwiek) {
		return Array(4 * masks_per_input).fill(true);
	}

	return mask;
}

function getDictTmp(dict, dict_scr, solutions) {
	const tmp = {};
	$.each(dict, function(state, moves) {
		if (Object.keys(dict_scr).includes(state)) {
			solutions.push(dict_scr[state].concat(moves));
		}
		addToTmp(moves, state, tmp);
	});

	return tmp;
}

function addToTmp(moves, state, tmp) {
	for (const move_name of ruchy2) {
		for (const turn of turn_names) {
			state = move(state, move_name);
			tmp[state] = moves.concat([ move_name + turn ]);
		}
		state = move(state, move_name);
	}
	return true;
}
