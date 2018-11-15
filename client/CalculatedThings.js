//*	-----------------------------------------------------------------------------------------------------------
//* 												<CSS Stylings>
//*	-----------------------------------------------------------------------------------------------------------

const PTO = temp1;

let css = [
	`input:focus,`,
	`select:focus,`,
	`textarea:focus,`,
	`button:focus {`,
	`	outline: none;`,
	`}`,
	``,
	`input {`,
	`	font-weight: bold;`,
	`}`,
	`input::selection {`,
	`	color: #000;`,
	`	background-color: #fff;`,
	`}`,
	`\n`
];
for(let i = 1; i < 13; i++) {
	let str = PTO.Enum.TagType.GetString(i);
	css.push(
		`.btn-${ str.toLowerCase() } {`,
        `   color: ${ PTO.Enum.TagType.GetColor(i) };`,
        `   border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };`,
        `}`,
		`.btn-${ str.toLowerCase() }:focus {`,
        `   color: #fff;`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };`,
		`	box-shadow: 0 0 5px ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
		`	border: 1px solid ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
		`}`,
		`.btn-${ str.toLowerCase() }:hover {`,
        `   color: #fff;`,
        `   border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 1.0, CSS: true }) };`,
		`}`,
		``,
		`.input-${ str.toLowerCase() } {`,
        `	color: ${ PTO.Enum.TagType.GetColor(i) };`,
        `   border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };`,
        `}		`,
		`.input-${ str.toLowerCase() }:focus {`,
        `   color: #fff;`,
        `   border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 1.0, CSS: true }) };`,
		`	box-shadow: 0 0 5px ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
		`	border: 1px solid ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };`,
        `}		`,
		`.input-${ str.toLowerCase() }::selection {`,
        `	color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.5, CSS: true }) };`,
        `   background-color: #fff;`,
		`}`,
		`.text-${ str.toLowerCase() } {`,
        `   color: ${ PTO.Enum.TagType.GetColor(i) };`,
        `}`,
		`.text-${ str.toLowerCase() }:hover {`,
        `   color: #fff;`,
        `   background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 1.0, CSS: true }) };`,
        `}`,
		`\n`
	);
}
css.push(
	`.btn-mutator {`,
	`	color: #000;`,
	`	border-color: rgba(0, 0, 0, 1.0);`,
	`	background-color: rgba(0, 0, 0, 0.3);`,
	`}`,
	`.btn-mutator:hover {`,
	`	color: #fff;`,
	`	border-color: rgba(0, 0, 0, 1.0);`,
	`	background-color: rgba(0, 0, 0, 1.0);`,
	`}`,
	`.text-mutator {`,
	`	color: #000;`,
	`}`,
	`.text-mutator:hover {`,
	`   color: #fff;`,
	`	background-color: rgba(0, 0, 0, 1.0);`,
	`}`,
	`\n`
);
css.push(
	`.btn-remove-element {`,
	`	color: rgba(198, 40, 40, 1);`,
	`	border-color: rgba(198, 40, 40, 1);`,
	`	background-color: rgba(198, 40, 40, 1);`,
	`	width: 6px !important;`,
	`	padding: 0;`,
	``,
	`	/* Lazily hides the text */`,
	`	overflow: hidden;`,
	`	transition: all .2s ease-in-out;`,
	`}`,
	`.btn-remove-element:hover {`,
	`	color: #fff;`,
	`	width: 64px !important;`,
	`}`
);
css.join("\n");

//*	-----------------------------------------------------------------------------------------------------------
//* 												</ CSS Stylings>
//*	-----------------------------------------------------------------------------------------------------------