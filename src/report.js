// report.js
import fs from 'fs';
import { parse } from 'csv-parse';
import * as hoffy from './hoffy.js';
import * as drawing from './drawing.js';
import * as spotify from './spotify.js';

const filePath = process.argv[2] || 'data/spotify-2023.csv';

fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;

    }
    parse(data, {}, (err, parsedData) => {
        if (err) {
            console.error(`Error parsing CSV: ${err.message}`);
            return;
        } 

        const headers = parsedData[0]; 
        const rows = parsedData.slice(1);

        const songs = hoffy.rowsToObjects({data: { headers, rows }});

        const validSongs = songs.filter(song => song.hasOwnProperty("artist(s)_name") && song["artist(s)_name"] !== undefined);
        const updatedSongs = validSongs.map(song => hoffy.stringFieldToList(song, "artist(s)_name"));

        const mostListened = spotify.mostStreamed(updatedSongs);
        console.log("most streamed song: ", mostListened);

        const songsWithDKey = spotify.getSongsByKey(updatedSongs, "D#");
        console.log("Songs with D key: ", songsWithDKey);

        const artists = spotify.artistCounts(updatedSongs);

        const top3Artists = Object.entries(artists)
        .sort((a,b) => b[1]-a[1])
        .slice(0,3);

        console.log(top3Artists)

        const rootSvg = new drawing.RootElement();
        rootSvg.addAttrs({width: 1000, height: 600});

        const maxHeight = 400;
        const barWidth = 200;
        const maxCount = top3Artists[0][1];

        const items = top3Artists.map(([artist, count], idx) => {
            const height = (count/maxCount) * maxHeight;
            const x = idx * (barWidth + 20); 
            const y = maxHeight - height; 

            return [
                new drawing.RectangleElement(x, y, barWidth, height, "blue"), 
                new drawing.TextElement(x + barWidth / 2, maxHeight + 20, 14, "black", `${artist}, ${count}`) 
            ];
        });

        rootSvg.children = hoffy.myFlatten(items);


        rootSvg.write("artists.svg", () => console.log("SVG file created!"));

    })

}
    
);
