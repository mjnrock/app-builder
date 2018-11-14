const PTO = temp1;

let css = [];
for(let i = 0; i < 13; i++) {
	let str = PTO.Enum.TagType.GetString(i);
	css.push(`
		.btn-${ str.toLowerCase() } {
            color: ${ PTO.Enum.TagType.GetColor(i) };
            border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };
            background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };
        }
		.btn-${ str.toLowerCase() }:hover {
            color: #fff;
            border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };
            background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 1.0, CSS: true }) };
		}
		
		.input-${ str.toLowerCase() } {
            color: ${ PTO.Enum.TagType.GetColor(i) };
            border-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };
            background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };
        }		
		.input-${ str.toLowerCase() }:focus {
            color: ${ PTO.Enum.TagType.GetColor(i) };
            background-color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };
			box-shadow: 0 0 5px ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };
			border: 1px solid ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, CSS: true}) };
        }		
		.input-${ str.toLowerCase() }::selection {
            color: ${ PTO.Enum.TagType.GetColor(i, { ToRGBA: true, a: 0.3, CSS: true }) };
            background-color: #fff;
        }
	`);
}
css.push(`
		.btn-mutator {
			color: #000;
			border-color: rgba(0, 0, 0, 1.0);
			background-color: rgba(0, 0, 0, 0.3);
		}
		.btn-mutator:hover {
			color: #fff;
			border-color: rgba(0, 0, 0, 1.0);
			background-color: rgba(0, 0, 0, 1.0);
		}
`);
css.push(`
		.btn-remove-element {
			color: #fff;
			border-color: rgba(198, 40, 40, 1);
			background-color: rgba(198, 40, 40, 1);
			width: 8px !important;
			padding: 0;
		}
		.btn-remove-element:hover {
			color: #c62828;
			border-color: rgba(198, 40, 40, 1);
			background-color: rgba(198, 40, 40, 0.3);
			width: 20px !important;
		}
`);
css.join("\n");