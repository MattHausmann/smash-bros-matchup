// CharacterPortrait.js
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";


const LabeledCharacterPortrait = ({ side, lockSwitch, onClick }) => {
	let { matchup, lockLeft } = useSelector((state) => state);
	let [name, setName] = useState("");
	let [baseImagePath, setBaseImagePath] = useState("");
	let [loading, setLoading] = useState(true);
	let [resolvedName, setResolvedName] = useState("");

	let fromNameToResolvedName = useMemo(() => {
		return {
			"R.O.B.": "R.O.B",
			"Bowser Jr.": "Bowser Jr",
			"Sheik / Zelda": "Sheik & Zelda",
			"Daisy": "Peach",
			"Dark Samus": "Samus",
			"Dark Pit": "Pit",
			"Richter": "Simon Belmont",
		};
	}, []);

	useEffect(() => {
		let newName = matchup.left;
		if (side === "right") {
			newName = matchup.right;
		}
		if (newName in fromNameToResolvedName) {
			newName = fromNameToResolvedName[newName];
		}

		setResolvedName(newName);
		setLoading(true);
		setBaseImagePath(`./characters/${matchup.videogameId}/${newName}/image.png`);
	}, [fromNameToResolvedName, matchup, side]);

	let dispatch = useDispatch();

	return (
		<div className="labeled-portrait">
			<img
				src={baseImagePath}
				alt={loading ? "Loading..." : resolvedName}
				onLoad={() => setLoading(false)}
			/>
			<p>{resolvedName}</p>
				{lockSwitch && (
					<label>
						Lock Character:
						<input type="checkbox" onChange={() => {dispatch({type:"toggleLockLeft"});}} />
					</label>
				)}
		</div>
	);
};

export default LabeledCharacterPortrait;
