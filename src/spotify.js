// spotify.js

import * as hoffy from './hoffy.js'

function mostStreamed(records) {

    const validRecords = records.filter(record => record.streams && !isNaN(Number(record.streams)))
    if (validRecords.length === 0){
        return null;
    }

    return validRecords.reduce((max, record) => {
        if (Number(record.streams) > Number(max.streams)) {
            record.streams = Number(record.streams)
            return record;
        }
        else {
            max.streams = Number(max.streams)
            return max;
        }
    }, validRecords[0]);
}

function getSongsByKey(records, key) {
    const validRecords = records.filter(record => record.hasOwnProperty("key"))
    return validRecords.filter(record => record.key == key).map((record) => `${record.track_name.toUpperCase()} (${key})`)
}

function artistCounts(records) {
    const validRecords = records.filter(record => record.hasOwnProperty("artist(s)_name"));
    const artistList = hoffy.myFlatten(validRecords.map(record => record["artist(s)_name"]))
    
    return artistList.reduce((counts, artist) => {
        if (counts.hasOwnProperty(artist)){
            counts[artist] += 1;
            return counts
        }
        else {
            counts[artist] = 1;
            return counts
        }
    },{})
}

export {
    mostStreamed,
    getSongsByKey,
    artistCounts
}