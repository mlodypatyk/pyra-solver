const permutations = [
	[ 0, 1, 19, 3, 23, 20, 4, 7, 8, 5, 2, 11, 12, 13, 14, 15, 16, 17, 18, 10, 9, 21, 22, 6 ], //R
	[ 6, 7, 8, 3, 4, 5, 12, 13, 14, 9, 10, 11, 0, 1, 2, 15, 16, 17, 18, 19, 20, 21, 22, 23 ], //U
	[ 16, 1, 2, 17, 14, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 15, 19, 18, 3, 0, 20, 4, 22, 23 ], //L
	[ 0, 1, 2, 3, 4, 5, 6, 7, 23, 9, 21, 22, 10, 13, 14, 11, 8, 17, 18, 19, 20, 12, 15, 16 ] //B
];
const ruchy = {
	R: 0,
	U: 1,
	L: 2,
	B: 3
};
const ruchy2 = [ 'R', 'U', 'L', 'B' ];
const solved = 'FFFFFFRRRRRRLLLLLLDDDDDD';

const v_list = [
	//zolty
	'***F*F***RRR***LLLD*DDDD',
	'***FFF***R*R***LLLDDDDD*',
	'***FFF***RRR***L*LDDD*DD',
	//zielony
	'FF*FFF*R*R***LL**LDDD***',
	'*FFFFFRR*R***L***LDDD***',
	'FFFF*FRR*R***LL**LD*D***',
	//niebieski
	'*FF**FRR*RRR*L*L****D*DD',
	'*FF**FRRRR*RLL*L****D*D*',
	'*F***F*RRRRRLL*L****D*DD',
	//czerwony
	'*F*F***RR**RLL*LLLD**DD*',
	'FF*F***RR**RLLLL*LD***D*',
	'FF*F***R***R*LLLLLD**DD*'
];
const layer_list = [
	'***FFF***RRR***LLLDDDDDD', //zolty
	'FFFFFFRR*R***LL**LDDD***', //zielony
	'*FF**FRRRRRRLL*L****D*DD', //niebieski
	'FF*F***RR**RLLLLLLD**DD*' //czerwony
];
const top_list = [
	'FFFF*FRRRR*RLLLL*LD*D*D*', //bez zoltego
	'*F*F*F*RRRRRLL*LLLD*DDDD', //bez zielonego
	'FF*FFF*R*R*R*LLLLLDDDDD*', //bez niebieskiego
	'*FFFFFRR*RRR*L*L*LDDD*DD' //bez czerwonego
];

const results = document.getElementById('reszta');

const textarea = document.getElementById('scr_area');

const valid_moves = [ 'R', "R'", 'L', "L'", 'U', "U'", 'B', "B'", 'r', "r'", 'l', "l'", 'u', "u'", 'b', "b'" ];

const turn_names = " '";
